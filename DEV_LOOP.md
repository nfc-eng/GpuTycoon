# GpuTycoon Dev Loop

Fully autonomous development loop for this React Native idle game. The loop repeats until every enabled phase passes in a single clean run. You do not stop until the change is committed and pushed.

## Project Context

- **Stack:** React Native, Expo, Jest, React Native Paper
- **Specs:** `FEATURES.md` is the source of truth — pick the next unimplemented feature from it
- **Tests:** `__tests__/` directory, run with `npm test`
- **Style guide:** Contribution Tenets in `README.md`

## Autonomy Rules

- You **MUST NOT** ask for confirmation between steps — just execute
- You **MUST** auto-fix all failures yourself and re-enter the loop
- You **MUST** keep looping until a clean pass through ALL phases — max 5 full loop iterations before stopping
- You **MUST** print a one-line status at the start of each phase: `[Loop N/5] Phase X: description`
- You **MUST** do ONE feature per loop invocation — read `FEATURES.md`, search the codebase to see what's already done, and pick the most important unfinished item
- You **MUST NOT** implement placeholders or stubs. Full implementations only.

## The Outer Loop

```
OUTER LOOP (iterates over features from FEATURES.md):
  Phase 0: Orient — find next unimplemented feature
  Phase 0.5: Grill — run GRILL.md, produce specs/<feature>.md

  INNER LOOP (max 5 iterations — until evaluator passes):
    Phase 1: Implement against the grilled spec
    Phase 2: Install deps + build check → on fail: fix, retry
    Phase 3: Run tests → on fail: fix, retry Phase 2
    Phase 4: Delegate to EVALUATOR subagent — separate agent reviews the diff
      → Evaluator finds issues: fix them, restart inner loop from Phase 1
      → Evaluator passes: break inner loop
  END INNER LOOP

  Phase 5: Commit and push
  Phase 6: Update AGENT.md with any learnings
  → Next feature (outer loop restarts)
END OUTER LOOP
```

## Phase Details

### Phase 0: Orient (every invocation)

1. Read `FEATURES.md` to understand the full spec
2. Search the codebase to determine what's already implemented (don't assume it's not done)
3. Pick the SINGLE most important unimplemented feature
4. Read `README.md` contribution tenets — follow them strictly
5. Read `AGENT.md` if it exists — it has learnings from prior loops

### Phase 0.5: Grill (spec generation)

Follow `GRILL.md` in autonomous mode:
- Walk through all question categories for the chosen feature
- Self-answer using codebase context and game design principles
- Output a spec to `specs/<feature-name>.md`
- The spec becomes the contract for Phase 1 — implement EXACTLY what it says

### Phase 1: Implement

- Implement the single feature picked from `FEATURES.md`
- Write or update tests in `__tests__/` for the new functionality
- Follow the contribution tenets: modular components, descriptive names, no cleverness
- If you discover a bug unrelated to your task, note it in `AGENT.md` but don't fix it now

### Phase 2: Build Check

```bash
cd /local/home/clenicho/workplace/ralph-test/GpuTycoon
npm install 2>&1 | tail -5
```

Verify no missing dependencies or syntax errors. If `npm install` fails, fix `package.json` and retry.

### Phase 3: Run Tests

```bash
cd /local/home/clenicho/workplace/ralph-test/GpuTycoon
npx jest --no-coverage 2>&1 | tail -30
echo "EXIT: $?"
```

- Exit 0 = all tests pass → proceed
- Exit non-zero = failures → read output, fix, go back to Phase 2
- Up to 5 retries before escalating

### Phase 4: Evaluator Review (SEPARATE AGENT)

Delegate to a separate evaluator subagent. Do NOT self-review — agents are bad at grading their own work (Anthropic's harness research confirms this: agents confidently praise mediocre output).

**Evaluator calibration:** The evaluator MUST be skeptical and adversarial. It assumes code is broken until proven otherwise. See `specs/evaluator-calibration.md` for few-shot grading examples.

#### 4a. Start the App

Before the evaluator runs, the generator MUST start the app for live validation:

```bash
cd /local/home/clenicho/workplace/ralph-test/GpuTycoon
npx expo start --web --port 8081 &
APP_PID=$!
sleep 8  # wait for bundler
```

#### 4b. Evaluator Receives

- The full `git diff`
- The feature spec from `specs/<feature>.md` (this is the CONTRACT — grade against it)
- The contribution tenets from `README.md`
- The running app URL: `http://localhost:8081`
- Instructions: "You are a skeptical senior QA engineer. Your job is to REJECT code that isn't production-ready. Be harsh. Find problems. Do not approve mediocre work. You MUST interact with the live app via Playwright before scoring."

#### 4c. Live App Validation (Playwright)

The evaluator MUST use Playwright MCP to validate the running app:

1. **Navigate** to `http://localhost:8081`
2. **Screenshot** the initial state — verify the app renders without crash
3. **Interact** with the feature under test:
   - Click buttons, navigate screens, trigger the new functionality
   - Verify visual feedback matches spec expectations
   - Check for console errors via `browser_console_messages`
4. **Screenshot** the result state — verify UI updated correctly
5. **Edge case probing** — try invalid inputs, rapid clicks, empty states

The evaluator documents what it saw (screenshots are evidence, not just vibes).

#### 4d. Grading Criteria

Each criterion must score 3+/5 to pass:

1. **Correctness:** Does the implementation match the spec? Edge cases handled?
2. **Completeness:** Any TODOs, stubs, or placeholder implementations? (UNACCEPTABLE — instant fail)
3. **Test coverage:** Does the new code have corresponding tests that actually assert behavior?
4. **Style:** Matches contribution tenets? Readable? Modular?
5. **Live app works:** App renders, feature is interactive, no console errors, UI matches spec

#### 4e. Termination

**If evaluator fails any criterion:** it returns specific issues with file:line references and severity (CRITICAL/MAJOR/MINOR). The generator fixes CRITICAL and MAJOR issues, then restarts the inner loop from Phase 1.

**If evaluator passes all criteria:** kill the app server and proceed to Phase 5.

```bash
kill $APP_PID 2>/dev/null
```

#### 4f. Context Reset

If the inner loop reaches iteration 3+, the generator's context is getting stale. Summarize the evaluator's feedback into a brief handoff note and restart the generator with a fresh context window reading only: the spec, the handoff note, and the current code.

### Phase 5: Commit and Push

```bash
cd /local/home/clenicho/workplace/ralph-test/GpuTycoon
git add -A
git commit -m "feat: <description of what was implemented>

- <bullet point details>
- Tests: added/updated <test file>"
git -c credential.helper='!gh auth git-credential' push
```

### Phase 6: Update AGENT.md

- Add any learnings, gotchas, or build tips discovered during this iteration
- Keep it brief — future loops read this to avoid repeating mistakes

## Backpressure Stack

The following reject invalid code (in order of speed):

1. `npm install` — catches dependency issues
2. `npx jest` — catches logic errors, regressions
3. Evaluator subagent — catches stubs, style violations, spec deviations, missing tests

## Context Preservation

After each loop, update `AGENT.md` so the NEXT loop iteration starts informed with build tips and gotchas.

## Recovery

If you wake up to a broken state:
1. Run `git log --oneline -5` to see recent commits
2. If last commit broke things: `git revert HEAD` and note the issue in `AGENT.md`
3. If multiple commits are bad: `git reset --hard <last_good_sha>` and regenerate approach
