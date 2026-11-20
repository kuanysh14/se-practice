# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- |---|
| Claude | Claude Sonnet 5.5 | read-only risk review (Task 2) | none, "WITHOUT editing files" |
| Claude | Claude Sonnet 5.5 | AGENTS.md review and patch draft (Task 6) | `app/project/AGENTS.md`, only after my approval |
| Claude | Claude Sonnet 5.5 | minimal patches for two risks (Task 8) | `app/project/src/booking.ts`, `app/project/src/booking.test.ts` (reviewed and applied by me) |
| Google Gemini | Gemini 4 Hydrogen | structuring the risk register, readiness audit rows, and verifying `check_audit.py` requirements | `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** yes
I used Google Gemini (`Gemini 4 Hydrogen`) to help verify the 12 readiness audit rows against `app/project/`, format the risk register and background-agent rules in `lab-report.md`, and verify `submission.yml` against `tests/validate_submission.py`.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
None, I inspected `AGENTS.md`, `src/booking.ts`, `src/lib/availability.ts`, and `src/data/sampleData.ts` directly, challenged Claude's unsupported claims in §3.2, rejected parts of its proposed `AGENTS.md` and refactor diffs, and verified all 20 Vitest tests locally.

Signed: Olzhabay Kuanysh
Date: 2026-11-20
