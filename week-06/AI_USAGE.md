# AI Usage Disclosure — Week 06

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- |---| --- | --- |
| Bolt.new | not displayed (Free tier) | prototype v1 (Task 2) | `original/project/*` (`src/App.tsx`, `src/lib/availability.ts`, `src/lib/time.ts`, `src/data/sampleData.ts`, `src/components/Clock.tsx`, `src/components/RoomList.tsx`, `src/components/IntervalForm.tsx`, `src/components/DecisionCard.tsx`, `src/components/BookingTimeline.tsx`, `package.json`) |
| Bolt.new | not displayed (Free tier) | cleanup prompts (Task 4) | `prototype/project/src/App.tsx`, `prototype/project/src/components/Clock.tsx`, `prototype/project/src/components/IntervalForm.tsx`, `prototype/project/src/components/RoomList.tsx`, `prototype/project/src/data/sampleData.ts`, `prototype/project/src/lib/availability.ts` |
| Gemini | Gemini 4 Argon | code review, checker verification, and report structuring | `lab-report.md`,`submission.yml` |

**I used another assistant as well (to explain code, to draft text in lab-report.md, …):** yes
Used Gemini to inspect the Bolt.new v1 and final zip exports against `tests/check_prototype.py` and `tests/validate_submission.py` and structure `lab-report.md`, `AI_USAGE.md`, and `submission.yml`.

**`original/` holds Bolt's first version exactly as downloaded, and `evidence/v1.png` shows it:** yes

**Every screenshot in `evidence/` is an unedited capture of the page as it behaved:** yes

**I can explain the component I chose in lab-report.md section 8 — and how the page decides
availability — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
None, I reviewed all generated TypeScript/React components (`src/lib/availability.ts`, `src/lib/time.ts`, `src/App.tsx`, and the five UI components in `src/components/`), rejected Bolt's suggestion to leave `@supabase/supabase-js` in `package.json`, and verified all nine test cases (T1–T9) in the browser.

Signed: Olzhabay Kuanysh

Date: 17.10.2026
