# AI Usage Disclosure — Week 11

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- |---| --- |---|
| Google Gemini | Gemini 4 Neon | the feature: mock adapter, explain.ts, the button (Task 3) | `app/project/src/booking.ts`, `app/project/src/explain.ts`, `app/project/src/explain.test.ts`, `app/project/src/App.tsx` |
| Claude | Claude Sonnet 5.5 | the three prompts compared (Task 4) | none, a fresh chat per prompt |
| Claude | Claude Sonnet 5.5 | read-only agentic review (Task 6) | none, "Do not edit files" |
| Google Gemini | Gemini 4 Neon | the two fixes (Task 7) | `app/project/src/explain.ts` (applied after my review) |

**Every file the assistant changed in Task 3 was reviewed by me before I accepted it (§4.2):** yes

**No API key, token or provider call is anywhere in `app/src/`:** yes

**The review in Task 6 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes

**I labelled every finding in §7.3 after verifying it myself:** yes

**I used another assistant as well (to explain an error, to draft text in lab-report.md, …):** yes
I used Google Gemini (`Gemini 4 Neon`) as the builder assistant for Task 3 and Task 7 and to help structure `lab-report.md` and `submission.yml`, while using Claude (`Claude Sonnet 5.5`) independently for Task 4 prompt comparison and Task 6 read-only code review.

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain how explainAvailability handles a timeout and a contradicting answer, without the
assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
None, I verified the grouped `TIME_RE` regex (`V1`), the `agreesWithDecision` / `sentenceCount` / `clearTimeout` / `Promise.resolve().then` guards (`V2`), and ran all 29 Vitest tests locally.

Signed: Olzhabay Kuanysh
Date: 2026-11-27
