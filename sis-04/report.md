# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | Claude |
| Assistant model | Claude Sonnet 5.5 |
| Starting point | week-08 |
| Baseline commit | 5755014 |
| Language (ts or js) | ts |
| Vitest version | 2.1.9 |
| Where I ran the tests | my computer |

### 1.1 Baseline run

```text
 RUN  v2.1.9 

 ✓ src/booking.test.ts (19)
   ✓ canBook (19)
     ✓ T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     ✓ T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     ✓ T15 AC5: available request returns true and leaves bookings unchanged (660-720)
     ✓ BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
     ✓ BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  21:38:08
   Duration  1.65s (transform 106ms, setup 0ms, collect 142ms, tests 30ms, environment 0ms, prepare 705ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
src/App.tsx — main page holding room selection, time inputs, and availability check state
src/booking.ts — exports canBook({ start, end, now, blocked, bookings }): boolean
src/booking.test.ts — 19 Vitest unit tests (T01–T14, X1, X2, T15 AC5, BUG-A, BUG-B)
src/lib/availability.ts — checkAvailability(req) calling canBook and building UI reason strings
src/lib/time.ts — time formatting helpers (minutesToLabel, MINUTES_PER_DAY)
src/data/sampleData.ts — hardcoded fictional sample rooms
src/components/RoomList.tsx, IntervalForm.tsx, Clock.tsx, DecisionCard.tsx, BookingTimeline.tsx — UI components
```

### 2.2 The context message as sent

```text
Analyze this repository map and requirements before we edit any code. Do not edit code yet.

Repository map:
- src/App.tsx — main page holding room selection, time inputs, and availability check state
- src/booking.ts — exports canBook({ start, end, now, blocked, bookings }): boolean
- src/booking.test.ts — 19 Vitest unit tests (T01–T14, X1, X2, T15 AC5, BUG-A, BUG-B)
- src/lib/availability.ts — checkAvailability(req) calling canBook and building UI reason strings
- src/lib/time.ts — time formatting helpers (minutesToLabel, MINUTES_PER_DAY)
- src/data/sampleData.ts — hardcoded fictional sample rooms
- src/components/RoomList.tsx, IntervalForm.tsx, Clock.tsx, DecisionCard.tsx, BookingTimeline.tsx — UI components

Requirements (AC1–AC6, F1–F5) & Constraints:
- Preserve AC1–AC6: valid time (0 <= start < end <= 1440, start > now), 120-minute maximum, blocked room rejection, overlap rules (touching is fine), immutable booking data, clear responsive feedback.
- New features:
  - 4+ fictional rooms (id, name, capacity, equipment list, blocked status, own bookings)
  - F1: capacity >= requested attendees
  - F2: the room has ALL selected equipment
  - F3: a blocked room is never reported available
  - F4: a clear empty state when no rooms match
  - F5: changing the selected room refreshes the result; the check uses THAT room's bookings
- Constraints: No login, no payments, no live APIs, no database, no browser storage. Fictional data only.

Target module layout:
- src/rooms.ts (type Room, ROOMS: Room[])
- src/filter.ts (filterRooms(rooms, { attendees, equipment }))
- src/booking.ts (canBook unchanged, checkRoom(rooms, roomId, { start, end, now }) calling canBook)
- App.tsx + components import these; no room data or business rules in UI components.

List at least 3 maintainability risks in the current codebase (with file/function and priority), propose a step-by-step improvement plan, and suggest how to structure filterRooms and checkRoom.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | `checkAvailability()` re-implements duration (`> 120`), overlap, and blocked checks to build UI reason strings, duplicating `canBook()`. | `src/lib/availability.ts`, `checkAvailability()` | In `src/lib/availability.ts`, `overlapsExisting()` and `end - start > 120` repeat the exact checks already inside `canBook()`. | High |
| 2 | Sample room data lacks an `equipment` field and lives in `src/data/sampleData.ts` instead of the target `src/rooms.ts` catalog. | `src/data/sampleData.ts`, `SAMPLE_ROOMS` | Existing room objects do not match `type Room = { id, name, capacity, equipment, blocked, bookings }`, blocking `F1`–`F2`. | High |
| 3 | `src/App.tsx` couples room selection state directly to static sample data without filtering or deriving availability cleanly on room switch (`F5`). | `src/App.tsx` | Switching rooms or filtering requires recomputing `filterRooms()` and `checkRoom()` on the active room so stale results cannot persist. | High |
| 4 | Test coverage only exercises `canBook()` directly; no tests cover `filterRooms()`, `checkRoom()`, or `F1`–`F5` boundaries. | `src/booking.test.ts` | All 19 baseline tests call `canBook()` directly, leaving `filterRooms()` and `checkRoom()` untested. | Medium |

### 3.2 Improvement plan — before editing

1. Create `src/rooms.ts` defining `type Room = { id, name, capacity, equipment, blocked, bookings }` and `ROOMS` with 4 fictional rooms (including varied capacities, equipment, and one blocked room), removing `src/data/sampleData.ts`.
2. Create `src/filter.ts` exporting `filterRooms(rooms, { attendees, equipment }): Room[]` enforcing `F1` (`capacity >= attendees`) and `F2` (`equipment.every(...)`).
3. Add `checkRoom(rooms, roomId, { start, end, now }): boolean` (calling `canBook`) and `getRejectionReasons()` to `src/booking.ts`, keeping `canBook` unchanged and eliminating rule duplication from `src/lib/availability.ts`.
4. Update `src/App.tsx` and UI components to add attendee/equipment filter controls, an empty state (`F4`), and automatic result refresh on room switch (`F5`), with zero business rules in UI files.
5. Expand `src/booking.test.ts` with tests for `AC1`–`AC5`, `F1`–`F5`, `B1`–`B6`, and `INT`, draw `diagrams/before.puml` and `diagrams/after.puml`, and capture the 5 screenshots in `evidence/`.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Change `checkRoom(rooms, roomId, { start, end, now })` to return a discriminated union `{ ok: true } \| { ok: false, reason: ... }` instead of a `boolean`. | Rejected | The SIS #04 brief and `check_sis.py` (`A4`, `S6` for `B1`/`B2`, `F3`, `F5`) explicitly require `checkRoom(...): boolean` returning `true`/`false`. Keeping `checkRoom` as `boolean` preserves the contract while `getRejectionReasons()` in `src/booking.ts` supplies UI messages. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
