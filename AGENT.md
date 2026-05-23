# AGENT.md — GpuTycoon

Learnings and build instructions for future loop iterations.

## Execution Plan

This repo uses the Ralph Wiggum technique: a cron-driven loop that spawns `gpu-multiagent` every 20 minutes. Each invocation reads `DEV_LOOP.md`, picks one unimplemented feature from `FEATURES.md`, implements it, tests it, and pushes.

## Git Policy

**Agents have permission to push directly to this repo.** This is a personal side project — no CR process, no review gates. Push after every successful loop iteration.

**Use `gh` CLI for all remote git operations** (not raw `git push`):
```bash
git -c credential.helper='!gh auth git-credential' push
```

## Build & Test

```bash
cd /local/home/clenicho/workplace/ralph-test/GpuTycoon
npm install
npx jest --no-coverage
```

## Stack

- React Native (Expo-compatible)
- React Native Paper for UI components
- Jest + @testing-library/react-native for tests
- No TypeScript yet (plain JS with babel)

## File Layout

- `App.js` — root component
- `src/components/` — UI components (BuildingItem, BuildingDetail, AddBuildingButton)
- `src/utils/` — business logic (simEngine.js, gameActions.js)
- `src/constants/` — game data (gpuTypes, powerTiers, coolingTiers, sizePresets, theme)
- `src/context/` — React context (GameContext.js)
- `__tests__/` — Jest test files

## Patterns

- Game state is a plain object passed through context
- All state mutations are pure functions in `gameActions.js` (return new state)
- `simEngine.tick(state)` computes one game tick (income, heat, power cost)
- Tests use `@testing-library/react-native` for component tests, plain Jest for logic

## Gotchas

(add learnings here as you discover them)
