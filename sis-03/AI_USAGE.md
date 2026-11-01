# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| Claude.ai | Claude Sonnet 5.5 | the plan (stage A) | `report.md` (§11 B1) | week-05 |
| Claude.ai | Claude Sonnet 5.5 | Python v1 (stage B) | `code/original/booking_v1.py`, `code/booking.py`, `code/test_booking.py` | week-05 |
| Bolt.new | not displayed (Free tier) | web prototype v1 (stage B) | `web/original/` | week-06 |
| Claude.ai | Claude Sonnet 5.5 | critique (stage C) | `report.md` (§8, §11 B3) | this SIS |
| Bolt.new | not displayed (Free tier) | repair (stage D) | `web/final/`, `report.md` (§7, §11 B4–B5) | week-06 / this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
Claude Sonnet 5.5 proposed the initial `code/test_booking.py` suite in Week 05, and I manually verified every expected value against AC1–AC5 before executing the code and added the `now=0` boundary tests (`test_start_at_midnight_with_now_at_midnight_is_rejected`, `test_start_one_minute_after_midnight_with_now_at_midnight`).

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:**
None, I verified every branch of `code/booking.py` (`0 <= start < end <= 1440`, `start <= now`, `end - start > 120`, `blocked`, and `start < booked_end and booked_start < end`) and every component in `web/final/project/src/` (`availability.ts`, `time.ts`, `Clock.tsx`, `RoomList.tsx`, `IntervalForm.tsx`, `DecisionCard.tsx`, `sampleData.ts`) by hand and across T1–T12.

Signed: Olzhabay Kuanysh
Date: 2026-11-01
