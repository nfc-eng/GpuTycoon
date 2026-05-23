# Evaluator Calibration Examples

Few-shot examples to calibrate your grading. Study these BEFORE scoring any submission.
Your scores should align with these reference points. If you find yourself scoring higher than these examples warrant, you are being too lenient.

---

## Example 1: PASS (scores 4-5 across the board)

**Feature:** "Buy GPU button adds a GPU to the selected shell"

**What the evaluator saw:**
- Diff adds `buyGpu(shellId)` to `gameActions.js` — pure function, returns new state
- Test file asserts: buying reduces money, increases GPU count, fails when insufficient funds
- Playwright: clicked "Buy GPU" button, money decreased from $1000 to $800, GPU count went from 2 to 3
- Console: no errors
- Edge case: clicked with $0 balance — button was disabled, no crash

**Scores:**
- Correctness: 5/5 — matches spec exactly, edge case handled
- Completeness: 5/5 — no stubs, full implementation
- Test coverage: 4/5 — happy path + insufficient funds tested, missing "max GPU" edge case
- Style: 4/5 — clean, follows patterns in gameActions.js
- Live app works: 5/5 — interactive, responsive, no errors

**Verdict: PASS** ✅

---

## Example 2: FAIL — stubs present (instant fail regardless of other scores)

**Feature:** "Save/load game state to AsyncStorage"

**What the evaluator saw:**
- Diff adds `saveGame()` and `loadGame()` to a new `src/utils/persistence.js`
- `saveGame()` has `// TODO: implement serialization` and just calls `console.log`
- `loadGame()` returns hardcoded initial state
- Tests exist but assert against the stub behavior (always passes, tests nothing)
- Playwright: app loads, but "Save" button logs to console instead of persisting

**Scores:**
- Correctness: 1/5 — doesn't actually save or load
- Completeness: 1/5 — **STUBS PRESENT — INSTANT FAIL**
- Test coverage: 1/5 — tests assert stub behavior, not real behavior
- Style: 3/5 — file structure is fine
- Live app works: 2/5 — button exists but does nothing

**Verdict: FAIL** ❌ — Severity: CRITICAL. Stubs are never acceptable.

---

## Example 3: FAIL — works in tests but broken in live app

**Feature:** "Cooling upgrade changes heat threshold"

**What the evaluator saw:**
- Diff modifies `simEngine.tick()` to use cooling tier thresholds
- Tests pass: unit tests correctly assert threshold changes per tier
- Playwright: navigated to shell detail, clicked "Upgrade Cooling"
  - **Console error:** `TypeError: Cannot read property 'heatCap' of undefined`
  - App shows white screen after clicking upgrade
- Root cause: component passes `coolingTier` as string but `simEngine` expects object

**Scores:**
- Correctness: 3/5 — logic is right in isolation
- Completeness: 4/5 — no stubs
- Test coverage: 3/5 — unit tests pass but integration gap missed
- Style: 4/5 — clean code
- Live app works: 1/5 — **CRASHES ON INTERACTION**

**Verdict: FAIL** ❌ — Severity: CRITICAL. `src/components/BuildingDetail.js:47` passes string instead of object to `simEngine.tick()`.

---

## Example 4: FAIL — feature works but no tests

**Feature:** "Display income per second in header"

**What the evaluator saw:**
- Diff adds `<IncomeDisplay>` component showing `$X/sec`
- Playwright: income displays correctly, updates each tick, formats nicely
- No test file added or modified
- Console: clean

**Scores:**
- Correctness: 5/5 — works perfectly
- Completeness: 5/5 — full implementation
- Test coverage: 1/5 — **ZERO TESTS FOR NEW CODE**
- Style: 4/5 — clean component
- Live app works: 5/5 — renders correctly

**Verdict: FAIL** ❌ — Severity: MAJOR. Must add test asserting income calculation and display formatting.

---

## Example 5: BORDERLINE PASS (scores exactly 3 on weakest criterion)

**Feature:** "Shell list shows all shells with GPU count"

**What the evaluator saw:**
- Diff adds `ShellList` component rendering `FlatList` of shells
- Each item shows shell name + GPU count
- Test asserts: renders correct number of items, shows GPU count
- Playwright: list renders 3 shells, scrollable, GPU counts match state
- Minor: no empty state handling (shows blank when 0 shells)

**Scores:**
- Correctness: 4/5 — works for normal case
- Completeness: 4/5 — no stubs
- Test coverage: 3/5 — basic assertions present, missing empty state test
- Style: 4/5 — follows FlatList pattern
- Live app works: 4/5 — renders correctly, minor empty state gap

**Verdict: PASS** ✅ (barely) — Note: empty state is a MINOR issue, not blocking.

---

## Scoring Principles

1. **Stubs = instant CRITICAL fail.** No exceptions. "Will implement later" is not acceptable.
2. **Live app crash = instant CRITICAL fail.** If Playwright shows a white screen or console error on the happy path, it fails.
3. **Zero tests = MAJOR fail.** Every new function/component needs at least one assertion.
4. **3/5 is the minimum passing score per criterion.** A 3 means "acceptable with minor gaps." A 2 means "has real problems."
5. **Don't grade on potential.** Grade what's IN the diff, not what it could become.
6. **Be specific in feedback.** "Needs improvement" is useless. "src/utils/simEngine.js:42 — tick() doesn't handle negative income" is actionable.
