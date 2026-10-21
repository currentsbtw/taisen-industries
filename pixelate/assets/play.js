/* Pixelate web play page. Plain JS, no build step, no network beyond this site's own files.
   The pure rules (matching, session, share text) are ports of the app's C# and are exported for tests
   when loaded under Node; the DOM part runs only in a browser. */
(function () {
  "use strict";

  // ---- Rules (ports of the app's GameSession, GuessMatcher, ResultGrid, ShareText) ----

  var STEPS = [6, 8, 12, 16, 24, 32];          // cells per side for guesses 1..6
  var FULL = 96;                               // shown once the puzzle is over
  var MAX_GUESSES = STEPS.length;
  var GLORY_MAX_CELLS = 8;                     // solved at 6x6 or 8x8
  var FREE_HINT_AFTER_WRONG = 2;
  var HINT2_AFTER_WRONG = 3;
  var FUZZY_MIN_LENGTH = 6;
  var ARTICLES = ["a ", "an ", "the "];
  var SHARE_URL = "https://taisenindustries.com/pixelate/";
  var GLORY_LINE = "✨ Glory solve";
  var SLOT = { EMPTY: 0, WRONG: 1, SOLVED: 2, FAILED: 3 };
  var EMOJI = ["⬜", "🟧", "🟩", "🟥"];   // white, orange, green, red squares; indexed by SLOT
  var EPOCH_Y = 2026, EPOCH_M = 9, EPOCH_D = 31;                            // 2026-10-31, month 0-based

  /** Lowercase, fold accents, every run of non letters/digits to one space, trimmed (GuessMatcher.NormalizeKeepArticles). */
  function normalizeKeepArticles(s) {
    if (s === null || s === undefined || s === "") return "";
    var out = String(s).normalize("NFD").toLowerCase();
    out = out.replace(/\p{Mn}/gu, "");                 // UnicodeCategory.NonSpacingMark
    out = out.replace(/[^\p{L}\p{Nd}]+/gu, " ");       // char.IsLetterOrDigit = letters + decimal digits
    out = out.trim();
    return out.normalize("NFC");
  }

  /** normalizeKeepArticles, then drop one leading "a ", "an " or "the " when something is left (GuessMatcher.Normalize). */
  function normalize(s) {
    var result = normalizeKeepArticles(s);
    for (var i = 0; i < ARTICLES.length; i++) {
      var a = ARTICLES[i];
      if (result.length > a.length && result.indexOf(a) === 0) {
        result = result.substring(a.length);
        break;
      }
    }
    return result;
  }

  /** Optimal string alignment distance (Damerau-Levenshtein with adjacent transpositions). */
  function distance(a, b) {
    a = a || ""; b = b || "";
    var n = a.length, m = b.length, i, j;
    if (n === 0) return m;
    if (m === 0) return n;
    var d = [];
    for (i = 0; i <= n; i++) { d.push(new Array(m + 1)); d[i][0] = i; }
    for (j = 0; j <= m; j++) d[0][j] = j;
    for (i = 1; i <= n; i++) {
      for (j = 1; j <= m; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var best = Math.min(Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1), d[i - 1][j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
          best = Math.min(best, d[i - 2][j - 2] + 1);
        d[i][j] = best;
      }
    }
    return d[n][m];
  }

  function isExact(g, rawTarget) {
    var t = normalize(rawTarget);
    return t.length > 0 && g === t;
  }

  function isOneEdit(g, rawTarget) {
    var t = normalize(rawTarget);
    if (t.length < FUZZY_MIN_LENGTH) return false;
    if (Math.abs(g.length - t.length) > 1) return false;
    return distance(g, t) <= 1;
  }

  function aliasesOf(puzzle) { return Array.isArray(puzzle.aliases) ? puzzle.aliases : []; }

  /** Exact over every target first, then (unless the guess is another vocabulary term) one edit of a long target. */
  function isMatch(guess, puzzle, blocked) {
    if (!puzzle) return false;
    var g = normalize(guess);
    if (g.length === 0) return false;
    var aliases = aliasesOf(puzzle), i;
    if (isExact(g, puzzle.answer)) return true;
    for (i = 0; i < aliases.length; i++) if (isExact(g, aliases[i])) return true;
    if (blocked && blocked.has(g)) return false;
    if (isOneEdit(g, puzzle.answer)) return true;
    for (i = 0; i < aliases.length; i++) if (isOneEdit(g, aliases[i])) return true;
    return false;
  }

  /** Every vocabulary word and alias, in file order (Vocabulary.Terms). */
  function vocabularyTerms(vocab) {
    var terms = [];
    var entries = vocab && Array.isArray(vocab.entries) ? vocab.entries : [];
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      if (!e) continue;
      if (typeof e.word === "string") terms.push(e.word);
      if (Array.isArray(e.aliases)) for (var j = 0; j < e.aliases.length; j++)
        if (typeof e.aliases[j] === "string") terms.push(e.aliases[j]);
    }
    return terms;
  }

  /** Normalised vocabulary terms that are not this puzzle's answer or aliases (GuessMatcher.BuildBlocklist). */
  function buildBlocklist(terms, puzzle) {
    var set = new Set(), i;
    if (terms) for (i = 0; i < terms.length; i++) {
      var n = normalize(terms[i]);
      if (n.length > 0) set.add(n);
    }
    if (puzzle) {
      set.delete(normalize(puzzle.answer));
      var aliases = aliasesOf(puzzle);
      for (i = 0; i < aliases.length; i++) set.delete(normalize(aliases[i]));
    }
    return set;
  }

  /** "Starts with J, 1 word" (GameSession.Hint2Text). */
  function hint2Text(answer) {
    var trimmed = String(answer || "").trim();
    if (trimmed.length === 0) return "";
    var words = trimmed.split(" ").filter(function (w) { return w.length > 0; }).length;
    return "Starts with " + trimmed[0].toUpperCase() + ", " + words + " " + (words === 1 ? "word" : "words");
  }

  /** The six-slot grid (ResultGrid.Slots). state: "idle" | "guessing" | "solved" | "failed". */
  function slotsFor(guessesUsed, state, maxGuesses) {
    maxGuesses = maxGuesses || MAX_GUESSES;
    var slots = [], i;
    for (i = 0; i < maxGuesses; i++) slots.push(i < guessesUsed ? SLOT.WRONG : SLOT.EMPTY);
    if (state === "solved" && guessesUsed > 0 && guessesUsed <= maxGuesses) slots[guessesUsed - 1] = SLOT.SOLVED;
    if (state === "failed" && maxGuesses > 0) slots[maxGuesses - 1] = SLOT.FAILED;
    return slots;
  }

  /** Share text (ShareText.Build with no streak and no hard mode: the web keeps neither). */
  function shareText(puzzleNumber, slots, archive, glory) {
    var line1 = "Pixelate #" + puzzleNumber + (archive ? " (archive)" : "") + "  " +
      slots.map(function (s) { return EMOJI[s]; }).join("");
    var lines = [line1];
    if (glory) lines.push(GLORY_LINE);
    lines.push(SHARE_URL);
    return lines.join("\n");
  }

  /** One puzzle's guess loop (GameSession): idle -> guessing -> solved | failed. */
  function createSession(puzzle, blocklist) {
    var s = {
      puzzle: puzzle,
      blocklist: blocklist || null,
      guesses: [],
      normalized: new Set(),
      state: "idle",
      stepSolved: 0,
      hintRevealed: false,
      hint2Revealed: false
    };
    s.isOver = function () { return s.state === "solved" || s.state === "failed"; };
    s.wrongCount = function () { return s.state === "solved" ? s.guesses.length - 1 : s.guesses.length; };
    s.currentCells = function () { return s.isOver() ? FULL : STEPS[Math.min(s.guesses.length, MAX_GUESSES - 1)]; };
    s.isGlory = function () {
      return s.state === "solved" && s.stepSolved >= 1 && s.stepSolved <= MAX_GUESSES && STEPS[s.stepSolved - 1] <= GLORY_MAX_CELLS;
    };
    s.freeHintUnlocked = function () { return s.state === "guessing" && s.wrongCount() >= FREE_HINT_AFTER_WRONG; };
    s.hint2Unlocked = function () { return s.state === "guessing" && s.wrongCount() >= HINT2_AFTER_WRONG; };
    s.hintsLeftToUnlock = function () { return Math.max(1, FREE_HINT_AFTER_WRONG - s.wrongCount()); };
    s.slots = function () { return slotsFor(s.guesses.length, s.state, MAX_GUESSES); };
    /** Returns "correct" | "wrong" | "duplicate" | "empty" | "gameover". */
    s.submit = function (guess) {
      if (s.isOver()) return "gameover";
      guess = typeof guess === "string" ? guess : "";
      var n = normalize(guess);
      if (n.length === 0) return "empty";
      if (s.normalized.has(n)) return "duplicate";
      if (s.state === "idle") s.state = "guessing";
      s.normalized.add(n);
      s.guesses.push(guess.trim());
      if (isMatch(guess, s.puzzle, s.blocklist)) {
        s.stepSolved = s.guesses.length;
        s.state = "solved";
        return "correct";
      }
      if (s.guesses.length >= MAX_GUESSES) s.state = "failed";
      return "wrong";
    };
    s.revealHint = function () {
      if (!s.freeHintUnlocked() || s.hintRevealed) return false;
      s.hintRevealed = true; return true;
    };
    s.revealHint2 = function () {
      if (!s.hint2Unlocked() || s.hint2Revealed) return false;
      s.hint2Revealed = true; return true;
    };
    return s;
  }

  // ---- Days ----

  function epochDate() { return new Date(EPOCH_Y, EPOCH_M, EPOCH_D); }

  /** Days since the epoch at local midnight (0 on launch day, negative before it). */
  function dayIndexFor(now) {
    var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((midnight - epochDate()) / 86400000);   // round absorbs DST hour shifts
  }

  function dateForDay(day) { return new Date(EPOCH_Y, EPOCH_M, EPOCH_D + day); }

  function isoDate(dt) {
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    return dt.getFullYear() + "-" + pad(dt.getMonth() + 1) + "-" + pad(dt.getDate());
  }

  /** Puzzle for a 0-based day: id === day + 1, else the one dated that day. */
  function puzzleForDay(puzzles, day) {
    if (!Array.isArray(puzzles)) return null;
    var i;
    for (i = 0; i < puzzles.length; i++) if (puzzles[i] && puzzles[i].id === day + 1) return puzzles[i];
    var iso = isoDate(dateForDay(day));
    for (i = 0; i < puzzles.length; i++) if (puzzles[i] && puzzles[i].date === iso) return puzzles[i];
    return null;
  }

  /** Visible notice when a link to a day that is not out yet falls back to today's puzzle. */
  var NOT_YET_NOTICE = "That one isn't out yet. Here is today's puzzle.";

  function validPuzzle(puzzle) {
    return !!puzzle && typeof puzzle.answer === "string" && typeof puzzle.image === "string" &&
      /^[A-Za-z0-9_-]+$/.test(puzzle.image);
  }

  /**
   * What to show. dParam: the raw ?d value or null. Returns {kind, day, puzzle, notice}, kind one of
   * "play" | "prelaunch" | "nopuzzle". Days later than today are never served: before launch only the
   * pre-launch state shows, whatever the link says; after launch a future day falls back to today's
   * puzzle with a notice. dev (a hand-set localStorage flag, never a URL parameter) lifts that for testing.
   */
  function resolveDay(dParam, today, puzzles, dev) {
    var day, notice = null;
    if (today < 0 && !dev) return { kind: "prelaunch", day: today };
    if (dParam === null || dParam === undefined) {
      day = today;
    } else {
      if (!/^-?[0-9]{1,9}$/.test(dParam)) return { kind: "nopuzzle", day: null };
      day = Number(dParam);
      if (day < 0) return { kind: "nopuzzle", day: day };
      if (day > today && !dev) { day = today; notice = NOT_YET_NOTICE; }
    }
    var puzzle = puzzleForDay(puzzles, day);
    if (!validPuzzle(puzzle)) return { kind: "nopuzzle", day: day };
    return { kind: "play", day: day, puzzle: puzzle, notice: notice };
  }

  /** "5h 12m" / "12m" until the next local midnight. */
  function countdownText(now) {
    var next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var mins = Math.max(1, Math.ceil((next - now) / 60000));
    var h = Math.floor(mins / 60), m = mins % 60;
    return h > 0 ? h + "h " + m + "m" : m + "m";
  }

  var api = {
    STEPS: STEPS, FULL: FULL, MAX_GUESSES: MAX_GUESSES, SLOT: SLOT, SHARE_URL: SHARE_URL,
    normalize: normalize, normalizeKeepArticles: normalizeKeepArticles, distance: distance,
    isMatch: isMatch, vocabularyTerms: vocabularyTerms, buildBlocklist: buildBlocklist,
    hint2Text: hint2Text, slotsFor: slotsFor, shareText: shareText, createSession: createSession,
    dayIndexFor: dayIndexFor, dateForDay: dateForDay, isoDate: isoDate, puzzleForDay: puzzleForDay,
    resolveDay: resolveDay, countdownText: countdownText, NOT_YET_NOTICE: NOT_YET_NOTICE
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof document === "undefined") return;

  // ---- Page ----

  var $ = function (id) { return document.getElementById(id); };

  function storageGet(key) {
    try { var raw = window.localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
    catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* private mode, quota: play on */ }
  }

  function fetchJson(url) {
    return fetch(url, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(url + " " + r.status);
      return r.json();
    });
  }

  function shortDate(dt) {
    try { return dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
    catch (e) { return isoDate(dt); }
  }

  function show(id, on) { var el = $(id); if (el) el.hidden = !on; }

  function showFunnel(day) {
    show("funnel", true);
    if (day !== null && day !== undefined && day >= 0) {
      $("open-app").href = "pixelate://day/" + day;
      show("open-app-line", true);
    } else {
      show("open-app-line", false);
    }
  }

  function showMessage(title, body, linkToToday) {
    show("view-loading", false);
    show("view-play", false);
    $("msg-title").textContent = title;
    $("msg-body").textContent = body;
    show("msg-link", !!linkToToday);
    show("view-message", true);
  }

  var params = new URLSearchParams(window.location.search);
  var dParam = params.get("d");
  var today = dayIndexFor(new Date());
  // Dev switch for testing scheduled days before they are out: set by hand in the console with
  // localStorage.setItem("pixelate.play.dev", "1"). Never a URL parameter, so links cannot open future days.
  var dev = false;
  try { dev = window.localStorage.getItem("pixelate.play.dev") === "1"; } catch (e) { dev = false; }

  Promise.all([
    fetchJson("../puzzles.json"),
    fetchJson("../assets/vocabulary.json").catch(function () { return null; })   // no blocklist without it, as in the app
  ]).then(function (res) {
    var data = res[0], vocab = res[1];
    var puzzles = data && Array.isArray(data.puzzles) ? data.puzzles : [];
    var todayPlayable = today >= 0 && !!puzzleForDay(puzzles, today);
    var r = resolveDay(dParam, today, puzzles, dev);

    if (r.kind === "prelaunch") {
      $("title").textContent = "Launching Oct 31";
      showMessage("Puzzle #1 arrives Oct 31",
        "Get the app to play it the day it lands. Once puzzles are out, links friends share with you open them here, past days included.", false);
      showFunnel(null);
      return;
    }
    if (r.kind === "nopuzzle") {
      $("title").textContent = "No puzzle here";
      showMessage("No puzzle for that link",
        todayPlayable ? "Check the link, or play today's puzzle instead." : "Check the link you followed.", todayPlayable);
      showFunnel(null);
      return;
    }
    var notice = $("notice");
    if (notice) { notice.textContent = r.notice || ""; notice.hidden = !r.notice; }
    startGame(r.day, r.puzzle, vocab);
  }).catch(function () {
    showMessage("Couldn't load the puzzle", "Check your connection and reload the page.", false);
    showFunnel(null);
  });

  function startGame(day, puzzle, vocab) {
    var isToday = day === today;
    var storageKey = "pixelate.play." + day;
    var blocklist = vocab ? buildBlocklist(vocabularyTerms(vocab), puzzle) : null;
    var session = createSession(puzzle, blocklist);
    var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    // Preload all seven steps so each appears instantly (kept referenced for the page's lifetime).
    var base = "../assets/puzzles/" + puzzle.image + "/";
    startGame.preloaded = STEPS.concat([FULL]).map(function (n) {
      var im = new Image(); im.src = base + n + ".png"; return im;
    });

    // Replay saved progress through the same state machine.
    var saved = storageGet(storageKey);
    if (saved && Array.isArray(saved.guesses)) {
      saved.guesses.slice(0, MAX_GUESSES).forEach(function (g) { if (typeof g === "string") session.submit(g); });
      session.hintRevealed = saved.hintRevealed === true;
      session.hint2Revealed = saved.hint2Revealed === true;
    }

    function save() {
      storageSet(storageKey, {
        guesses: session.guesses.slice(),
        solved: session.state === "solved",
        hintRevealed: session.hintRevealed,
        hint2Revealed: session.hint2Revealed
      });
    }

    var img = $("reveal"), statusEl = $("status"), feedback = $("feedback"), input = $("guess");
    var trackerEl = $("tracker"), slotEls = trackerEl.querySelectorAll(".slot");
    var feedbackTimer = 0;

    $("title").textContent = "Puzzle #" + puzzle.id + " · " + shortDate(dateForDay(day));

    function say(text, transient) {
      clearTimeout(feedbackTimer);
      feedback.textContent = text;
      if (transient) feedbackTimer = setTimeout(function () { feedback.textContent = ""; }, 2200);
    }

    function renderImage() {
      var cells = session.currentCells();
      img.src = base + cells + ".png";
      img.setAttribute("data-step", String(cells));
      img.alt = session.isOver()
        ? "The full picture: " + puzzle.answer
        : "Puzzle #" + puzzle.id + " as a " + cells + " by " + cells + " block mosaic";
    }

    var SLOT_CLASS = ["empty", "wrong", "solved", "failed"];
    function renderTracker() {
      var slots = session.slots();
      for (var i = 0; i < slotEls.length; i++) slotEls[i].className = "slot " + SLOT_CLASS[slots[i]];
      var wrong = session.wrongCount(), label;
      if (session.state === "solved") label = "Solved on guess " + session.stepSolved + " of 6";
      else if (session.state === "failed") label = "Six wrong guesses";
      else label = wrong + (wrong === 1 ? " wrong guess, " : " wrong guesses, ") + (MAX_GUESSES - wrong) + " left";
      trackerEl.setAttribute("aria-label", label);
    }

    function renderHints() {
      var playing = !session.isOver();
      var unlocked = session.freeHintUnlocked();
      var lines = [];
      if (playing && session.hintRevealed) lines.push("Category: " + (puzzle.category || ""));
      if (playing && session.hint2Revealed) lines.push(hint2Text(puzzle.answer));
      var hintText = $("hint-text");
      hintText.textContent = lines.join("\n");
      hintText.hidden = lines.length === 0;

      var hint1 = $("hint1"), lock = $("hint-lock"), hint2 = $("hint2");
      hint1.hidden = !(playing && !session.hintRevealed);
      hint1.disabled = !unlocked;
      var showLock = playing && !session.hintRevealed && !unlocked;
      if (showLock) {
        var left = session.hintsLeftToUnlock();
        lock.textContent = "Unlocks in " + left + " " + (left === 1 ? "guess" : "guesses");
      }
      lock.hidden = !showLock;
      hint2.hidden = !(session.hint2Unlocked() && !session.hint2Revealed);
      show("hints", playing);
    }

    function renderStatus() {
      if (session.state === "solved") statusEl.textContent = "Solved in " + session.stepSolved;
      else if (session.state === "failed") statusEl.textContent = "Not today";
      else {
        var n = Math.min(session.guesses.length + 1, MAX_GUESSES), c = session.currentCells();
        statusEl.textContent = "Guess " + n + " of " + MAX_GUESSES + " · " + c + "×" + c;
      }
    }

    var countdownTimer = 0;
    function renderCountdown() {
      clearTimeout(countdownTimer);
      var el = $("countdown");
      if (!isToday) { el.hidden = true; return; }
      var now = new Date();
      if (dayIndexFor(now) !== day) {
        el.textContent = "";
        var a = document.createElement("a");
        a.href = "./";
        a.textContent = "Today's puzzle is out. Play it";
        el.appendChild(a);
        el.hidden = false;
        return;
      }
      el.textContent = "Next puzzle in " + countdownText(now);
      el.hidden = false;
      countdownTimer = setTimeout(renderCountdown, 60000 - (now.getSeconds() * 1000 + now.getMilliseconds()) + 50);
    }

    function currentShareText() {
      return shareText(puzzle.id, session.slots(), !isToday, session.isGlory());
    }

    function renderEnd() {
      var over = session.isOver();
      show("guess-form", !over);
      show("end", over);
      if (!over) return;
      $("end-title").textContent = session.isGlory() ? "Glory solve!" : "";
      show("end-title", session.isGlory());
      $("end-answer").textContent = "It was: " + puzzle.answer;
      $("share-preview").textContent = currentShareText();
      renderCountdown();
      showFunnel(day);
    }

    function render() {
      renderImage();
      renderStatus();
      renderTracker();
      renderHints();
      renderEnd();
    }

    function shake() {
      if (reduceMotion) return;
      var stage = $("stage");
      stage.classList.remove("shake");
      void stage.offsetWidth;   // restart the animation
      stage.classList.add("shake");
    }

    $("guess-form").addEventListener("submit", function (ev) {
      ev.preventDefault();
      var outcome = session.submit(input.value);
      if (outcome === "empty") { input.focus(); return; }
      if (outcome === "duplicate") { say("Already guessed", true); input.select(); return; }
      if (outcome === "gameover") return;
      input.value = "";
      save();
      render();
      if (outcome === "correct") {
        say("Correct!");
        $("share").focus();
      } else if (session.state === "failed") {
        say("Out of guesses.");
        $("share").focus();
      } else {
        var c = session.currentCells();
        say("Not it. Guess " + (session.guesses.length + 1) + " of 6, " + c + " by " + c + ".");
        shake();
        input.focus();
      }
    });

    $("hint1").addEventListener("click", function () {
      if (session.revealHint()) { save(); renderHints(); say("Category: " + (puzzle.category || "")); input.focus(); }
    });
    $("hint2").addEventListener("click", function () {
      if (session.revealHint2()) { save(); renderHints(); say(hint2Text(puzzle.answer)); input.focus(); }
    });

    // Share: the OS sheet when available, else the clipboard, else a selectable text box.
    var shareNote = $("share-note"), fallback = $("share-fallback");
    function showFallback(text) {
      fallback.value = text;
      fallback.hidden = false;
      fallback.focus();
      fallback.select();
      shareNote.textContent = "Copy the text below to share.";
    }
    function copy(text) {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () { shareNote.textContent = "Copied"; },
          function () { showFallback(text); });
      } else {
        showFallback(text);
      }
    }
    $("share").addEventListener("click", function () {
      var text = currentShareText();
      var data = { text: text };
      shareNote.textContent = "";
      var canShare = typeof navigator.share === "function" &&
        (typeof navigator.canShare !== "function" || navigator.canShare(data));
      if (!canShare) { copy(text); return; }
      navigator.share(data).catch(function (err) {
        if (err && err.name === "AbortError") return;   // the sheet was closed
        copy(text);
      });
    });

    show("view-loading", false);
    show("view-message", false);
    show("view-play", true);
    render();
  }
})();
