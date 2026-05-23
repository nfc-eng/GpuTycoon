# Grill Me — Feature Spec Generator

Interview relentlessly about a feature until reaching a comprehensive, implementable spec. Resolve every branch of the decision tree before any code is written.

## Trigger

Run this BEFORE the dev loop for each feature. Input: a short 1-2 sentence feature description from `FEATURES.md`.

## Behavior

### Interactive Mode (human present)
Ask ONE question at a time. For each question:
1. State the question clearly
2. Provide your recommended answer based on the codebase and game design
3. Wait for the human to confirm, override, or expand

Continue until all branches are resolved. Then output the spec.

### Autonomous Mode (no human — overnight Ralph loop)
Ask and self-answer every question using:
- The existing codebase (search before assuming)
- `FEATURES.md` for product intent
- `README.md` contribution tenets for style/architecture decisions
- `AGENT.md` for technical patterns already established
- Common sense game design principles

Log your Q&A reasoning in the spec so a human can review the decisions later.

## Question Categories

For each feature, walk through these branches:

### 1. Scope
- What exactly does this feature do? (be precise)
- What does it NOT do? (explicit boundaries)
- What's the minimum viable version vs nice-to-have?

### 2. Data Model
- What state does this feature need?
- Where does it live? (existing context, new context, AsyncStorage)
- What's the shape? (types, defaults, constraints)

### 3. UI/UX
- What component(s) are needed?
- Where do they appear in the app hierarchy?
- What user interactions trigger behavior?
- What feedback does the user see?

### 4. Integration
- What existing code does this touch?
- Does it modify `simEngine.tick()`? `gameActions.js`? Context?
- Are there ordering dependencies with other features?

### 5. Edge Cases
- What happens at zero state? (no money, no buildings, empty)
- What happens at overflow? (max buildings, max GPUs)
- What happens on error? (save fails, invalid state)

### 6. Testing
- What are the key assertions?
- What's the happy path test?
- What's the most important edge case test?

## Output Format

After all questions are resolved, produce a spec file:

```markdown
# Feature Spec: <feature name>

## Summary
<1-2 sentences>

## Decisions Made
- <decision 1>: <chosen option> (reason)
- <decision 2>: <chosen option> (reason)

## Implementation Plan
1. <step 1 — specific file + what to add/change>
2. <step 2>
3. ...

## Data Model Changes
<describe new state shape or modifications>

## Tests Required
- [ ] <test 1 description>
- [ ] <test 2 description>

## Acceptance Criteria
- [ ] <criterion 1>
- [ ] <criterion 2>
```

Save the spec to `specs/<feature-name>.md` in the repo before starting the dev loop.

## Anti-Slop Rules

- Every implementation step must reference a SPECIFIC file and function
- No vague steps like "add UI for this" — specify the component name, where it renders, what props it takes
- No unresolved questions — if something is ambiguous, make a decision and document why
- The spec must be detailed enough that a junior dev (or a dumb agent) could implement it without asking questions
