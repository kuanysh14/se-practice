# Week 06 — Lab report

**Name:** Olzhabay Kuanysh

**Group:** Monday (18:00-19:00)

**Date:** 17.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| |   |
| --- |---|
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | not displayed |
| Bolt project link (or `not shared`, and why) | https://bolt.new/p/72116215  |
| Browser and version | Google Chrome (Desktop) |
| If you could not use Bolt.new: the tool you used instead, and why | none |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- |---|
| 1 | v1 will hardcode the current time or use the live system clock (`new Date()`) instead of providing a supplied current-time input, preventing us from setting current time to 09:00 for T1–T9 and T6. | AC1 | Yes, `Clock.tsx` and `App.tsx` read `new Date()` with no input to set the supplied current time to 09:00, making T6 Not testable and rejecting daytime slots when tested in the afternoon. |
| 2 | v1 will either mutate bookings on check or mishandle room/interval setup (such as disabling blocked rooms in the UI or misformatting validation feedback). | AC3, AC4, AC5, AC6 | Partially, v1 did not mutate bookings (AC5 held) and allowed touching endpoints (AC4 held), but `RoomList.tsx` set `disabled={room.blocked}` on Cedar Seminar Room so T3 was Not testable, and `availability.ts` displayed overlap intervals in raw minutes (`600–660 min`). |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements:
AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.
Intervals include the start and exclude the end.
Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes

**Bolt's list of the files/components it created, pasted unedited:**

```text
Main files created
- src/lib/availability.ts — the availability-check logic and types (all the acceptance criteria live here).
- src/lib/time.ts — minute/HH:MM conversion helpers.
- src/data/sampleData.ts — fictional sample rooms with pre-set bookings.
- src/components/Clock.tsx, RoomList.tsx, IntervalForm.tsx, DecisionCard.tsx, BookingTimeline.tsx — the UI pieces.
- src/App.tsx — the page that wires them together.
```

**What v1 does — one line per thing that works, or visibly does not:**

- Renders four sample campus rooms (`Aurora Hall`, `Beacon Room`, `Cedar Seminar Room`, and `Driftwood Lounge`) with a 24-hour visual booking timeline and read-only in-memory state that never mutates existing bookings on check (AC5 works).
- Evaluates candidate start and end times immediately as the user types in `IntervalForm.tsx` and shows an `Available` or `Unavailable` card with rejection reasons in `DecisionCard.tsx`.
- Locks `Current time` in `Clock.tsx` to the browser's live clock (`new Date()`) with no input to set the supplied current time to `09:00` (breaking T6 setup and causing pre-current-time rejections when tested after 09:00).
- Disables clicking blocked rooms in `RoomList.tsx` (`disabled={room.blocked}` on `Cedar Seminar Room`), making it impossible to select a blocked room in the UI to test T3 (AC3).
- Formats overlapping booking intervals in `availability.ts` as raw minutes after midnight (`600–660 min`) instead of `HH:MM` (`10:00–11:00`) and includes an unused `@supabase/supabase-js` dependency in `package.json`.

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Unavailable | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Not testable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Unavailable | Available | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Unavailable | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Unavailable | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Unavailable | Available | final-T9.png |
---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Missing supplied current-time input, unselectable blocked room, and extra booking on Beacon Room (`Clock.tsx`, `RoomList.tsx`, `sampleData.ts`) | Set up base case (current time 09:00, Beacon Room with only 10:00–11:00 booked) and test T1 (11:00–12:00), T3 (blocked room 11:00–12:00), and T6 (09:00–09:30 at 09:00) → AC1 and AC3 expect T1/T4/T8/T9 Available and T3/T6 Unavailable → `Clock.tsx` locks current time to `new Date()` (~17:09) so T6 is Not testable and T1/T4/T8/T9 return Unavailable, while `RoomList.tsx` sets `disabled={room.blocked}` on Cedar Seminar Room so T3 is Not testable | High | Fix |
| 2 | Raw-minute overlap message, generic reversed-time feedback, duplicated `nowToMinutes`, and unused `@supabase/supabase-js` in `package.json` (`availability.ts`, `Clock.tsx`, `package.json`) | Enter overlapping slot 10:30–11:30 (T2) or reversed slot 12:00–11:00 (T7) on Beacon Room and inspect source → AC6 and scope expect clear human-readable HH:MM feedback and no database/backend packages → `availability.ts` displays `(600–660 min)` instead of `10:00–11:00` and a raw inequality message for reversed times, `nowToMinutes()` is duplicated in `App.tsx` and `Clock.tsx`, and `package.json` lists `@supabase/supabase-js` | Medium | Fix |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
Prompt sent:
In the current prototype, selecting Beacon Room (or attempting to select blocked Cedar Seminar Room) to test T1–T9 with base current time 09:00 and only booking 10:00–11:00 produces Not testable for T3 and T6 and Unavailable for T1, T4, T8, and T9 because Clock.tsx locks current time to new Date() instead of an editable time input, RoomList.tsx sets disabled={room.blocked} so blocked rooms cannot be selected, and Beacon Room in sampleData.ts has an extra 14:00–15:00 booking, but AC1 and AC3 require accepting candidate intervals after a supplied current time (provide an editable Current time input in Clock.tsx/App.tsx defaulting to 09:00, remove min attribute restriction on start time input in IntervalForm.tsx so 09:00 can be entered for T6, and select Beacon Room by default with only one booking 10:00–11:00) and rejecting requests when a blocked room is selected or toggled (remove disabled={room.blocked} in RoomList.tsx and add a "Room blocked" checkbox toggle or allow selecting a blocked room with 10:00–11:00 booking). Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.

Bolt's answer:
Here's what I changed and why, to make all of T1–T9 testable:

- src/components/Clock.tsx — replaced the read-only "current time" button (locked to the real clock) with an editable time input. It still displays and lets you type/scroll the current campus time, which AC1 needs so the start must be after the supplied current time. Defaults are driven by App.
- src/App.tsx — default current time is now 09:00 and the default-selected room is Beacon Room. This gives a stable base for the test cases instead of the real wall-clock time and the "first non-blocked" pick.
- src/data/sampleData.ts — removed Beacon Room's second booking so it has only the 10:00–11:00 booking, matching the test scenario.
- src/components/IntervalForm.tsx — removed the min attribute on the start-time field (and the now-unused nowMinutes prop). The browser min was silently blocking 09:00 when the real clock was past it, making T6 "not testable." Validation is still enforced by the decision logic in availability.ts, so AC1 is preserved.
- src/components/RoomList.tsx — removed disabled={room.blocked} so a blocked room can be selected. Selecting it now drives the decision card to Unavailable with the blocked reason, exercising AC3 instead of making it unselectable. A blocked room shows a red selected state for clarity.

All other acceptance criteria (the 120-minute cap, overlap rules with touching endpoints allowed, read-only booking data, responsive layout, validation feedback) are unchanged and still enforced by src/lib/availability.ts.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
Prompt sent:
Review only src/lib/availability.ts, src/components/Clock.tsx, src/App.tsx, and package.json (specifically: format overlap error times in availability.ts using minutesToLabel as HH:MM instead of raw minutes like 600–660 min and provide a clear message when end time is before or equal to start time for AC6, remove the unusednowToMinutes duplication between App.tsx and Clock.tsx, and remove the unused @supabase/supabase-js dependency from package.json) for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6.

Bolt's answer:
Review findings and the cleanup I implemented:

- src/lib/availability.ts — The overlap error showed raw minutes (600–660 min), which is confusing. I switched it to HH:MM via the shared minutesToLabel (now 10:00–11:00). I also added a dedicated "End time must be after the start time." reason when end <= start, so AC6 gives understandable feedback for the inverted-interval case instead of only the generic bounds message. Both preserve AC1–AC6: validation is unchanged, only the wording improved.
- src/components/Clock.tsx — Removed the duplicated minutesToLabel/labelToMinutes helpers (they were copies of the ones in src/lib/time.ts) and imported the shared versions instead. Pure dedup, no behavior change.

One cleanup I deliberately did not do: removing @supabase/supabase-js from package.json. It's not causing a UI, naming, or duplication problem within the reviewed files, and removing a dependency plus its lockfile/env wiring is the kind of change that can ripple. If you'd like, I can do that as a separate, isolated step.
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Replaced the read-only live clock in `Clock.tsx` with an editable time input defaulting to `09:00` in `App.tsx`, removed `min` from `IntervalForm.tsx`, and set `Beacon Room` with only the `10:00–11:00` booking in `sampleData.ts` | accept | Required by AC1 ("start is after the supplied current time") and AC4 so the base test setup (`09:00` current time and `10:00–11:00` booking) can be configured directly in the page | Retested T6 first (now Unavailable as expected), then all T1–T9: all 9 cases match Expected |
| 2 | Removed `disabled={room.blocked}` in `RoomList.tsx` so blocked `Cedar Seminar Room` can be selected in the UI | accept | Required by AC3 ("Reject the request when the selected room is blocked") so selecting a blocked room reaches `checkAvailability` and shows Unavailable | Retested T3 first (now Unavailable with blocked reason), then all T1–T9: all 9 cases match Expected |
| 3 | Formatted overlap rejection times as `HH:MM` via `minutesToLabel`, added a clear `"End time must be after the start time."` message in `availability.ts`, and deduplicated time helpers in `Clock.tsx` | accept | Improves validation feedback clarity for AC6 without altering AC1–AC5 decision logic | Retested T2 and T7 first, then all T1–T9: T2 shows `10:00–11:00`, T7 explains why, all 9 pass |
| 4 | Bolt suggested keeping `"@supabase/supabase-js"` in `package.json` to avoid touching dependency wiring | reject | Violates prototype scope ("no login, backend, database, or external API") and fails checker rule P3; removed the unused line from `package.json` and deleted `dist/` build artifacts by hand edit | Re-ran `check_prototype.py` and retested T1–T9: P1–P3 pass and all 9 cases match Expected |
---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | Issue 1 — Current time locked to `new Date()`, blocked room disabled, and extra booking on Beacon Room | Fix (Prompt 2) | `src/components/Clock.tsx`, `src/App.tsx`, `src/components/IntervalForm.tsx`, `src/components/RoomList.tsx`, `src/data/sampleData.ts` — editable current time defaulting to `09:00`, selectable blocked room, and single `10:00–11:00` booking on Beacon Room | Retested T1–T9: T3 and T6 became testable and returned Unavailable; T1, T4, T8, T9 returned Available (9/9 match Expected) |
| 2 | Issue 2 — Raw-minute overlap message, generic reversed-time message, and duplicated time helpers | Fix (Prompt 3) | `src/lib/availability.ts`, `src/components/Clock.tsx` — formatted overlap range with `minutesToLabel` (`10:00–11:00`), added explicit `"End time must be after the start time."` reason, and imported shared helpers from `src/lib/time.ts` | Retested T2, T7, and all T1–T9: T2 displays `(10:00–11:00)`, T7 shows clear reversed-time message, all 9/9 match Expected |
| 3 | Issue 2 — Unused `@supabase/supabase-js` dependency and compiled `dist/` bundle triggering P3 scope check | Fix (hand edit after rejecting Bolt's suggestion to keep it) | `package.json` (hand edit: removed unused `"@supabase/supabase-js"` line) and deleted `dist/` build output folder from `prototype/project/` | Re-ran `check_prototype.py` and retested T1–T9: P1, P2, P3 all PASS and all 9/9 cases match Expected |


---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `src/lib/availability.ts`

<!-- Write your explanation below this line -->

The file `src/lib/availability.ts` contains the pure function `checkAvailability` and its helper `overlapsExisting`, which together enforce AC1 through AC5 without modifying any room or booking state. It accepts a `CheckRequest` object containing the selected `room`, candidate `start` and `end` times in minutes from midnight, and `nowMinutes`, and collects rejection messages in a `reasons` array:
1. It checks whether `end <= start` and whether `0 <= start < end <= 1440` (`MINUTES_PER_DAY`), plus `start <= nowMinutes`, rejecting intervals that are reversed, out of bounds, or not strictly after the supplied current time (AC1, AC6).
2. It checks whether `end - start > 120` and adds a rejection reason when the requested duration exceeds two hours (AC2).
3. It checks `room.blocked` and rejects the request with the room's `blockedReason` when the room is blocked (AC3).
4. It calls `overlapsExisting(start, end, room.bookings)`, which loops through existing bookings and tests strict inequality `start < b.end && b.start < end` so half-open intervals `[start, end)` that merely touch at an endpoint (such as `11:00–12:00` after `10:00–11:00`) are allowed while true overlaps are rejected (AC4).
Finally, if `reasons.length === 0`, it returns `{ status: 'available' }`; otherwise it returns `{ status: 'unavailable', reasons }` for `DecisionCard.tsx` to display (AC5).
---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 27 checks in `tests/check_prototype.py` pass (`pass=27 fail=0 error=0`). |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

- Declared as `not-expressible`. Even though `checkAvailability` in `src/lib/availability.ts` permits `end <= 1440`, the UI uses standard HTML `<input type="time">` controls in `src/components/IntervalForm.tsx` and parses values with `labelToMinutes` in `src/lib/time.ts`, which restricts hours to `0 <= h <= 23` and minutes to `0 <= mm <= 59` (up to `23:59`, or `1439` minutes). Consequently, a user cannot enter `24:00` (`1440`) as an end time. This is acceptable for a campus room availability prototype because university study and seminar rooms close before midnight, and keeping native `<input type="time">` controls provides reliable mobile and desktop usability (AC6) without custom text-input parsing bugs.

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

- In `v1`, `src/App.tsx` and `src/components/Clock.tsx` called `new Date()` (`d.getHours() * 60 + d.getMinutes()`) to read the browser's live wall-clock time and rendered it inside a button that only refreshed to the current system clock every 30 seconds or on click. Because `v1` provided no input field to supply a custom current time of `09:00`, case T6 (`09:00–09:30` with current time `09:00`) was **Not testable** on `v1`, and testing daytime intervals (`T1`, `T4`, `T8`, `T9`) in the afternoon (~17:09) caused `v1` to reject all of them as starting before the current time.

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between &quot;the prototype looks finished&quot; and &quot;the prototype meets
         AC1-AC6&quot; - shown with one case from section 4?
     Worthless: &quot;Bolt made some mistakes and I fixed them.&quot;
     Worth everything: &quot;T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data.&quot; -->

<!-- Write your conclusion below this line -->

My first prediction in Section 2 was completely right, and my second was partially right: while `v1` preserved booking data (AC5) and allowed touching endpoints (AC4), it locked current time to `new Date()` in `Clock.tsx` instead of a supplied time input (AC1), disabled clicking blocked rooms (`disabled={room.blocked}`) in `RoomList.tsx` (AC3), and showed raw minutes (`600–660 min`) on overlaps (AC6).

During cleanup (Prompt 3), I rejected Bolt's suggestion to leave `@supabase/supabase-js` in `package.json`. Accepting that suggestion would have violated the one-page, no-database scope rule and caused check P3 to fail, so I removed the unused dependency and `dist/` bundle via a small hand edit.

Case T3 shows the difference between looking finished and meeting AC1–AC6: `v1` rendered a polished "Blocked" badge on Cedar Seminar Room, but because the card button was disabled, a student could never select the room to receive an Unavailable decision and maintenance reason as AC3 requires.