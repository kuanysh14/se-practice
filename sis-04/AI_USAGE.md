# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- |---| --- | --- | --- |
| Claude | Claude Sonnet 5.5 | 2026-11-15 | codebase analysis (Task 1) | `report.md` (Section 3.1, 3.3, 8.1) |
| Claude | Claude Sonnet 5.5 | 2026-11-15 | improvement plan | `report.md` (Section 3.2, 8.1) |
| Google Gemini | Gemini 4 Argon | 2026-11-15 | feature extension (Task 2) | `app/project/src/rooms.ts`, `app/project/src/filter.ts`, `app/project/src/booking.ts`, `app/project/src/App.tsx` |
| Google Gemini | Gemini 4 Argon | 2026-11-15 | refactoring (Task 3) | `app/project/src/booking.ts`, `app/project/src/lib/availability.ts`, `diagrams/before.puml`, `diagrams/after.puml` |
| Google Gemini | Gemini 4 Argon | 2026-11-15 | tests (Task 4) | `app/project/src/booking.test.ts` |

**The assistant wrote, or helped write, tests in `app/`:** yes
I used Google Gemini (`Gemini 4 Argon`) to help structure the 15 Vitest test cases (`AC1`–`AC5`, `F1`–`F5`, `B1`–`B6`, and `INT`) in `src/booking.test.ts`. I verified that every expected value was derived strictly from the requirements (`AC1`–`AC5` and `F1`–`F5`) rather than from what the code returned, and ran `npx vitest run` locally to verify all 15 tests pass.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
None, I reviewed every module (`rooms.ts`, `filter.ts`, `booking.ts`, `availability.ts`, `App.tsx`) and all 15 tests in `booking.test.ts`, rejected Claude's non-boolean return-type suggestion for `checkRoom`, and verified all requirements locally.

Signed: Olzhabay Kuanysh
Date: 2026-11-15
