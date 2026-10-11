# AI Usage Disclosure — Week 05

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| Claude | Claude Sonnet 5.5 | the plan (Task 1) | lab-report.md §2 |
| Claude | Claude Sonnet 5.5 | the first version, v1 (Task 2) | code/original/booking_v1.py, code/booking.py |
| Claude | Claude Sonnet 5.5 | my tests, debugging, critique (Tasks 3-5) | code/test_booking.py, lab-report.md §4, §5, §6 |

**The assistant wrote, or helped write, my tests in `code/`:** yes
<!-- The assistant proposed the full test_booking.py suite. I checked every expected value by
     hand against AC1-AC5 before running anything, the AC map in §3 and the per-test AC column
     in §4 are that check, done before v1 was ever executed, not derived from its output. -->

**`code/original/` holds the assistant's first answer exactly as returned:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition:** yes

**Anything I accepted from the AI without fully understanding it:**
None, every line of code/booking.py was traced to an AC and verified by hand (lab-report.md §3)
before it was run, and both critique suggestions were independently checked against the contract
before being rejected (§6).

Signed: Olzhabay Kuanysh
Date: 11.10.2026