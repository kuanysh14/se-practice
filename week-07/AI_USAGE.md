# AI Usage Disclosure — Week 07

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude | Claude Sonnet 5.5 | the first test suite (Task 3) | `suites/first/booking.test.ts`, `app/project/src/booking.test.ts` |
| Claude | Claude Sonnet 5.5 | the improvement prompt (Task 5) | `app/project/src/booking.test.ts` |
| Google Gemini | Gemini 3.1 Pro | guidance on extracting `canBook`, reviewing test plan boundaries (`X1`, `X2`), and verifying checker requirements | `app/project/src/booking.ts`, `app/project/src/lib/availability.ts`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**I used an assistant to extract `canBook` (Task 1), or to fix a defect in it:** yes
<!-- If "yes": which change, in which file, and how you checked that the behaviour did not change. -->
I used Gemini to help extract the boolean availability rules from `src/lib/availability.ts` into `export function canBook({ start, end, now, blocked, bookings })` in `src/booking.ts` and call `canBook` from `checkAvailability` in `src/lib/availability.ts`. I verified that the behavior did not change by running the 17-case Vitest suite (`T01`–`T14`, `AC5`, `X1`, `X2`) and performing manual UI checks `U1`–`U5`.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- If "yes": which one, the exact model, and for which section. -->
I used Google Gemini (`Gemini 3.1 Pro`) to help structure the test plan reasons in Section 3, review decisions in Section 5, comparison table in Section 9.2, and format `lab-report.md` and `submission.yml`.

**`suites/first/` holds the assistant's first test file exactly as it generated it:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every test in my final suite — its input, its expected result and the AC behind
it — without the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
None, I reviewed every test case (`T01`–`T14`, `T15 AC5`, `X1`, `X2`), the `makeParams` helper, `structuredClone`, and `JSON.stringify` assertions in `src/booking.test.ts` and ran all Vitest and mutant trials locally.

Signed: Olzhabay Kuanysh
Date: 2026-11-06
