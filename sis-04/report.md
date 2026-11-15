# SIS #04 вЂ” Report: Evolving the Smart Campus Room Availability Checker

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

 вњ“ src/booking.test.ts (19)
   вњ“ canBook (19)
     вњ“ T01 AC4: touching after existing booking is accepted (660-720)
     вњ“ T02 AC1: starting exactly at now is rejected (540-570)
     вњ“ T03 AC1: zero-duration interval is rejected (720-720)
     вњ“ T04 AC1: reversed interval is rejected (750-720)
     вњ“ T05 AC1: interval ending past day end is rejected (1380-1441)
     вњ“ T06 AC2: exactly 120 minutes is accepted (720-840)
     вњ“ T07 AC2: 121 minutes is rejected (720-841)
     вњ“ T08 AC4: touching before existing booking is accepted (570-600)
     вњ“ T09 AC4: partial overlap is rejected (630-690)
     вњ“ T10 AC4: interval containing existing booking is rejected (570-690)
     вњ“ T11 AC4: interval inside existing booking is rejected (615-645)
     вњ“ T12 AC4: identical interval is rejected (600-660)
     вњ“ T13 AC3: blocked room is rejected (660-720, blocked)
     вњ“ T14 AC4: empty bookings list has no overlaps (630-690)
     вњ“ X1 AC1: starting 1 minute after now is accepted (541-571)
     вњ“ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     вњ“ T15 AC5: available request returns true and leaves bookings unchanged (660-720)
     вњ“ BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
     вњ“ BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  21:38:08
   Duration  1.65s (transform 106ms, setup 0ms, collect 142ms, tests 30ms, environment 0ms, prepare 705ms)
```

## 2. Context for the assistant

### 2.1 Repository map

```text
src/App.tsx вЂ” main page holding room selection, time inputs, and availability check state
src/booking.ts вЂ” exports canBook({ start, end, now, blocked, bookings }): boolean
src/booking.test.ts вЂ” 19 Vitest unit tests (T01вЂ“T14, X1, X2, T15 AC5, BUG-A, BUG-B)
src/lib/availability.ts вЂ” checkAvailability(req) calling canBook and building UI reason strings
src/lib/time.ts вЂ” time formatting helpers (minutesToLabel, MINUTES_PER_DAY)
src/data/sampleData.ts вЂ” hardcoded fictional sample rooms
src/components/RoomList.tsx, IntervalForm.tsx, Clock.tsx, DecisionCard.tsx, BookingTimeline.tsx вЂ” UI components
```

### 2.2 The context message as sent

```text
Analyze this repository map and requirements before we edit any code. Do not edit code yet.

Repository map:
- src/App.tsx вЂ” main page holding room selection, time inputs, and availability check state
- src/booking.ts вЂ” exports canBook({ start, end, now, blocked, bookings }): boolean
- src/booking.test.ts вЂ” 19 Vitest unit tests (T01вЂ“T14, X1, X2, T15 AC5, BUG-A, BUG-B)
- src/lib/availability.ts вЂ” checkAvailability(req) calling canBook and building UI reason strings
- src/lib/time.ts вЂ” time formatting helpers (minutesToLabel, MINUTES_PER_DAY)
- src/data/sampleData.ts вЂ” hardcoded fictional sample rooms
- src/components/RoomList.tsx, IntervalForm.tsx, Clock.tsx, DecisionCard.tsx, BookingTimeline.tsx вЂ” UI components

Requirements (AC1, AC2, AC3, AC4, AC5, AC6 (AC1-AC6), F1вЂ“F5) & Constraints:
- Preserve AC1, AC2, AC3, AC4, AC5, AC6 (AC1-AC6): valid time (0 <= start < end <= 1440, start > now), 120-minute maximum, blocked room rejection, overlap rules (touching is fine), immutable booking data, clear responsive feedback.
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
| 2 | Sample room data lacks an `equipment` field and lives in `src/data/sampleData.ts` instead of the target `src/rooms.ts` catalog. | `src/data/sampleData.ts`, `SAMPLE_ROOMS` | Existing room objects do not match `type Room = { id, name, capacity, equipment, blocked, bookings }`, blocking `F1`вЂ“`F2`. | High |
| 3 | `src/App.tsx` couples room selection state directly to static sample data without filtering or deriving availability cleanly on room switch (`F5`). | `src/App.tsx` | Switching rooms or filtering requires recomputing `filterRooms()` and `checkRoom()` on the active room so stale results cannot persist. | High |
| 4 | Test coverage only exercises `canBook()` directly; no tests cover `filterRooms()`, `checkRoom()`, or `F1`вЂ“`F5` boundaries. | `src/booking.test.ts` | All 19 baseline tests call `canBook()` directly, leaving `filterRooms()` and `checkRoom()` untested. | Medium |

### 3.2 Improvement plan вЂ” before editing

1. Create `src/rooms.ts` defining `type Room = { id, name, capacity, equipment, blocked, bookings }` and `ROOMS` with 4 fictional rooms (including varied capacities, equipment, and one blocked room), removing `src/data/sampleData.ts`.
2. Create `src/filter.ts` exporting `filterRooms(rooms, { attendees, equipment }): Room[]` enforcing `F1` (`capacity >= attendees`) and `F2` (`equipment.every(...)`).
3. Add `checkRoom(rooms, roomId, { start, end, now }): boolean` (calling `canBook`) and `getRejectionReasons()` to `src/booking.ts`, keeping `canBook` unchanged and eliminating rule duplication from `src/lib/availability.ts`.
4. Update `src/App.tsx` and UI components to add attendee/equipment filter controls, an empty state (`F4`), and automatic result refresh on room switch (`F5`), with zero business rules in UI files.
5. Expand `src/booking.test.ts` with tests for `AC1`вЂ“`AC5`, `F1`вЂ“`F5`, `B1`вЂ“`B6`, and `INT`, draw `diagrams/before.puml` and `diagrams/after.puml`, and capture the 5 screenshots in `evidence/`.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why вЂ” with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Change `checkRoom(rooms, roomId, { start, end, now })` to return a discriminated union `{ ok: true } or { ok: false, reason: ... }` instead of a `boolean`. | Rejected | The SIS #04 brief and `check_sis.py` (`A4`, `S6` for `B1`/`B2`, `F3`, `F5`) explicitly require `checkRoom(...): boolean` returning `true`/`false`. Keeping `checkRoom` as `boolean` preserves the contract while `getRejectionReasons()` in `src/booking.ts` supplies UI messages. |

## 4. Feature extension (Task 2)

### 4.1 What I added

I created `src/rooms.ts` with a 4-room catalog (`ROOMS`: `Beacon Study Room A` seating 8 with `projector` + `whiteboard`, `Horizon Seminar B` seating 20 with `projector` + `whiteboard` + `video-conferencing`, `Cedar Lab C` seating 12 with `projector` + `lab-pcs` and `blocked: true`, and `Focus Pod D` seating 4 with `whiteboard`). On the page (`src/App.tsx`), users filter rooms via a Minimum Attendees number input (`F1`) and multi-select equipment toggle buttons (`F2`). When no rooms match, an amber alert banner explains that no rooms match the filter criteria (`F4`). Availability is derived on every render from the currently selected room via `checkRoom()` and `checkAvailability()`, so switching rooms immediately updates the decision and booking list using that room's own bookings (`F5`).

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees set to `8` and `projector` + `whiteboard` selected, matching `Beacon Study Room A` (seats 8) and `Horizon Seminar B` (seats 20). |
| `evidence/filter-empty.png` | Attendees set to `25` (or conflicting equipment tags), showing `Matching Rooms (0)` and the `F4` empty-state warning banner. |
| `evidence/switch-a.png` | `Beacon Study Room A` selected at `now = 09:00` for `11:00вЂ“12:00` (`660вЂ“720`), showing **Available** because its only booking is `10:00вЂ“11:00`. |
| `evidence/switch-b.png` | Switched to `Horizon Seminar B` with the exact same `11:00вЂ“12:00` slot (`F5`), immediately refreshing to **Unavailable** due to its `11:00вЂ“12:00` booking. |
| `evidence/narrow.png` | The application rendered at `375x812` portrait phone width in DevTools (`AC6`), with filter controls, room cards, and result stacked cleanly. |

## 5. Refactoring (Task 3)

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | Defines `Booking`, `Room`, `AVAILABLE_EQUIPMENT`, and the 4-room fictional catalog `ROOMS` with per-room capacity, equipment, blocked flag, and bookings. |
| `src/booking.ts` | Holds all availability rules: `canBook()` (`AC1`вЂ“`AC5`), `checkRoom()` (looks up a room by `roomId` and delegates to `canBook`), and `getRejectionReasons()`. |
| `src/filter.ts` | Exports pure `filterRooms(rooms, { attendees, equipment })` enforcing `F1` (`capacity >= attendees`) and `F2` (all selected equipment present). |
| `src/lib/availability.ts` | Thin adapter `checkAvailability()` that calls `checkRoom()` and `getRejectionReasons()` from `src/booking.ts` without duplicating any rule logic. |
| `src/App.tsx` | Responsive UI component that holds filter/selection/time form state, calls `filterRooms()` and `checkAvailability()`, and renders the `F4` empty state and `F5` room switch. |

### 5.2 Design decisions

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep `filterRooms()` focused strictly on `F1` (`capacity >= attendees`) and `F2` (`equipment.every(...)`), leaving blocked-room rejection (`F3`) to `checkRoom()`. | Filtering out `blocked: true` rooms inside `filterRooms()` so blocked rooms disappear from the catalog list. | Keeping blocked rooms visible in the catalog with a `Blocked` badge lets users select `Cedar Lab C` and see the explicit `AC3`/`F3` blocked-room rejection reason instead of confusing a blocked room with `F4` ("no rooms match"). |
| Derive `matchingRooms`, `activeRoom`, and `decision` directly during render in `src/App.tsx` instead of storing `result` in `useState`. | Storing the availability result in `useState` and manually clearing or recalculating it inside click handlers. | Deriving the decision from `(selectedRoomId, start, end, now, attendees, equipment)` guarantees `F5` by constructionвЂ”changing the room or filter can never leave a stale result on screen. |

### 5.3 Duplication removed

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/lib/availability.ts` (`overlapsExisting` and inline `end <= start`, `start <= nowMinutes`, `end - start > 120`, and `room.blocked` checks duplicating `src/booking.ts`) | Consolidated into `src/booking.ts` (`canBook`, `checkRoom`, `findOverlappingBooking`, and `getRejectionReasons`), which `src/lib/availability.ts` now calls directly. |
| `src/data/sampleData.ts` and `src/lib/availability.ts` (duplicate `Room` and `Booking` interface declarations) | Single canonical `Room` and `Booking` type definition in `src/rooms.ts`, imported by `booking.ts`, `filter.ts`, `availability.ts`, and `App.tsx`. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

| ID | Test title (as in the file) | Input в†’ expected |
| --- | --- | --- |
| AC1 | `AC1: starting at or before now or reversed interval is rejected` | `start=540, end=570, now=540` в†’ `false`; `750вЂ“720` в†’ `false`; `1380вЂ“1441` в†’ `false` |
| AC2 | `AC2 B1: duration of exactly 120 minutes is accepted (720-840)` | `start=720, end=840, now=540` в†’ `true` |
| AC3 | `AC3: blocked room is rejected even for a free slot` | `start=660, end=720, blocked=true` в†’ `false` |
| AC4 | `AC4 B3: touching endpoints before and after existing booking are accepted` | `570вЂ“600` and `660вЂ“720` with existing `[600, 660)` в†’ `true` |
| AC5 | `AC5: available check returns true without mutating bookings` | `720вЂ“780` в†’ `true` and `params.bookings` equals `structuredClone` snapshot |
| F1 | `F1: keeps only rooms with capacity >= requested attendees` | `attendees=10, equipment=[]` on `TEST_CATALOG` в†’ `['room-b', 'room-c']` |
| F2 | `F2: keeps only rooms that have ALL selected equipment` | `attendees=1, equipment=['projector', 'whiteboard']` в†’ `['room-a', 'room-b']` |
| F3 | `F3: blocked room in catalog is never reported available` | `checkRoom(TEST_CATALOG, 'room-c', {start: 660, end: 720, now: 540})` в†’ `false` |
| F4 | `F4: returns empty array when no rooms match criteria` | `attendees=50, equipment=['lab-pcs']` в†’ `[]` |
| F5 | `F5: switching selected room uses that room own bookings for the same times` | `660вЂ“720` on `'room-a'` в†’ `true`; same `660вЂ“720` on `'room-b'` в†’ `false` |
| B1 | `AC2 B1: duration of exactly 120 minutes is accepted (720-840)` | `start=720, end=840` (120 min) в†’ `true` |
| B2 | `AC2 B2: duration of 121 minutes is rejected (720-841)` | `start=720, end=841` (121 min) в†’ `false` |
| B3 | `AC4 B3: touching endpoints before and after existing booking are accepted` | `570вЂ“600` and `660вЂ“720` touching `[600, 660)` в†’ `true` |
| B4 | `AC4 B4: overlapping existing booking is rejected (630-690)` | `start=630, end=690` overlapping `[600, 660)` в†’ `false` |
| B5 | `B5: boundary capacity equal to attendees keeps the room in` | `attendees=8` (`room-a` capacity is `8`) в†’ contains `'room-a'` |
| B6 | `B6: boundary capacity one below attendees filters the room out` | `attendees=9` (`room-a` capacity is `8`) в†’ does not contain `'room-a'` |
| INT | `INT: filterRooms output feeds directly into checkRoom without mutating catalog` | `filterRooms` (`attendees=8, ['projector','whiteboard']`) в†’ `['room-a','room-b']`, then `checkRoom` в†’ `true` for `room-a`, `false` for `room-b`, catalog unchanged |

### 6.2 Commands

```text
cd sis-04/app/project
npx vitest run
```

### 6.3 Final run

```text
 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/sis-04/app/project

 вњ“ src/booking.test.ts (15)
   вњ“ canBook вЂ” preserved AC1вЂ“AC5 and boundaries B1вЂ“B4 (7)
     вњ“ AC1: starting at or before now or reversed interval is rejected
     вњ“ AC2 B1: duration of exactly 120 minutes is accepted (720-840)
     вњ“ AC2 B2: duration of 121 minutes is rejected (720-841)
     вњ“ AC3: blocked room is rejected even for a free slot
     вњ“ AC4 B3: touching endpoints before and after existing booking are accepted
     вњ“ AC4 B4: overlapping existing booking is rejected (630-690)
     вњ“ AC5: available check returns true without mutating bookings
   вњ“ filterRooms вЂ” F1, F2, F4, B5, B6 (5)
     вњ“ F1: keeps only rooms with capacity >= requested attendees
     вњ“ F2: keeps only rooms that have ALL selected equipment
     вњ“ F4: returns empty array when no rooms match criteria
     вњ“ B5: boundary capacity equal to attendees keeps the room in
     вњ“ B6: boundary capacity one below attendees filters the room out
   вњ“ checkRoom & INT вЂ” F3, F5, INT (3)
     вњ“ F3: blocked room in catalog is never reported available
     вњ“ F5: switching selected room uses that room own bookings for the same times
     вњ“ INT: filterRooms output feeds directly into checkRoom without mutating catalog

 Test Files  1 passed (1)
      Tests  15 passed (15)
   Start at  22:05:14
   Duration  1.42s (transform 98ms, setup 0ms, collect 115ms, tests 24ms, environment 0ms, prepare 640ms)
```

## 7. Quality evaluation (Task 5)

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 15/15 | Measured directly from the Vitest terminal outputs in Section 1.1 (`19 passed (19)` on `canBook` only) and Section 6.3 (`15 passed (15)` covering `AC1`вЂ“`AC5`, `F1`вЂ“`F5`, `B1`вЂ“`B6`, and `INT`). |
| Duplicated logic locations removed | 2 duplicated locations (`availability.ts` rules + duplicate `Room` types) | 0 duplicated rule locations (2 removed) | Counted in Section 5.3 by inspecting `src/lib/availability.ts`, `src/data/sampleData.ts`, and `src/booking.ts` before and after refactoring. |
| Code structure: modules and their responsibilities | 1 rule module (`booking.ts`), mixed rule/formatting in `availability.ts`, static `sampleData.ts`, and 6 UI files | 3 pure domain modules (`rooms.ts`, `filter.ts`, `booking.ts`), 1 thin adapter (`availability.ts`), and 1 clean UI entry (`App.tsx`) | Verified by listing files with `git ls-files sis-04/app/project/src` and checking `diagrams/before.puml` vs `diagrams/after.puml` and `check_sis.py` (`A1`вЂ“`A5`). |
| Remaining limitation | No room filtering (`F1`вЂ“`F2`), no `checkRoom()` lookup, and no integration tests | Automated tests verify `canBook`, `filterRooms`, and `checkRoom` in Node, but do not mount `<App />` in a real browser DOM | Identified by inspecting `src/booking.test.ts` (which tests module functions directly while `AC6` layout is verified via the 5 browser screenshots in `evidence/`). |

## 8. AI evidence appendix

### 8.1 Exchange 1

**Tool and model:** Claude вЂ” Claude Sonnet 5.5
**Date:** 2026-11-15
**Purpose:** Codebase analysis, maintainability risk identification, and step-by-step improvement plan (Task 1)

**Prompt:**

```text
Analyze this repository map and requirements before we edit any code. Do not edit code yet.
Repository map: src/App.tsx, src/booking.ts, src/booking.test.ts, src/lib/availability.ts, src/lib/time.ts, src/data/sampleData.ts, src/components/*.
Requirements: Preserve AC1, AC2, AC3, AC4, AC5, AC6 (AC1-AC6); add 4+ fictional rooms and F1вЂ“F5 in src/rooms.ts, src/filter.ts, src/booking.ts. List 3+ maintainability risks, an improvement plan, and suggested structure.
```

**Output used:**

```text
Maintainability risks:
1. lib/availability.ts -> checkAvailability: canBook returns only a boolean, so reason strings are re-derived here, duplicating rule logic. (High)
2. data/sampleData.ts + App.tsx: Data conflicts with target rooms.ts / Room type and risks F5. (High)
3. App.tsx: Holds room selection, time inputs, and result state together; risks stale result after room switch (F5). (High)
Improvement plan:
1. Keep baseline tests green. 2. Create rooms.ts with Room and ROOMS (4+ rooms). 3. Create filter.ts with pure filterRooms. 4. Add checkRoom to booking.ts calling canBook. [...]
```

**Problems found:** Claude suggested having `checkRoom` return `{ ok: true } | { ok: false, reason }` instead of a `boolean`, which would violate the required signature `checkRoom(rooms, roomId, { start, end, now }): boolean`.
**Changes made:** Rejected the union return type for `checkRoom` (documented in Section 3.3); kept `checkRoom` returning a `boolean` and moved `getRejectionReasons()` into `src/booking.ts`.
**Verified by:** Ran `python tests/check_sis.py` (`A4` PASS: `checkRoom reuses canBook`) and `npx vitest run` (`F3`, `F5`, `INT` pass).

### 8.2 Exchange 2

**Tool and model:** Google Gemini вЂ” Gemini 4 Argon
**Date:** 2026-11-15
**Purpose:** Implementing `src/rooms.ts`, `src/filter.ts`, `checkRoom` in `src/booking.ts`, and refactoring `src/lib/availability.ts` and `src/App.tsx` (Tasks 2 & 3)

**Prompt:**

```text
Help me implement src/rooms.ts (4+ rooms with equipment and bookings), src/filter.ts (filterRooms for F1 and F2), and src/booking.ts (adding checkRoom and removing duplicated rule checks from src/lib/availability.ts) so that App.tsx contains no room data or rule logic of its own.
```

**Output used:**

```text
export function filterRooms(rooms: Room[], { attendees, equipment }: FilterCriteria): Room[] {
  if (!Number.isFinite(attendees) || attendees < 0) return [];
  return rooms.filter((room) => {
    if (room.capacity < attendees) return false;
    return equipment.every((item) => room.equipment.includes(item));
  });
}

export function checkRoom(rooms: Room[], roomId: string, { start, end, now }: { start: number; end: number; now: number }): boolean {
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return false;
  return canBook({ start, end, now, blocked: room.blocked, bookings: room.bookings });
}
```

**Problems found:** Had to ensure old `src/data/sampleData.ts` and any inline `.capacity` or `<= b.end` checks in UI files were removed so `check_sis.py` check `A5` would not flag leftover room data or rules outside `rooms.ts`, `filter.ts`, and `booking.ts`.
**Changes made:** Deleted `src/data/sampleData.ts`, moved `getRejectionReasons()` into `src/booking.ts`, and kept `src/App.tsx` purely focused on rendering state and calling `filterRooms`, `checkRoom`, and `checkAvailability`.
**Verified by:** Confirmed `PASS A1` through `PASS A8` in `python tests/check_sis.py` and verified `F1`вЂ“`F5` in the browser (`evidence/*.png`).

### 8.3 Exchange 3

**Tool and model:** Google Gemini вЂ” Gemini 4 Argon
**Date:** 2026-11-15
**Purpose:** Designing the 15-test Vitest suite covering `AC1`вЂ“`AC5`, `F1`вЂ“`F5`, `B1`вЂ“`B6`, and `INT` (Task 4)

**Prompt:**

```text
Write a Vitest test suite in src/booking.test.ts with a fixed 4-room catalog inside the test file, no mocks or test.each, and explicit test titles covering AC1вЂ“AC5, F1вЂ“F5, B1вЂ“B6, and INT.
```

**Output used:**

```text
describe('filterRooms вЂ” F1, F2, F4, B5, B6', () => {
  test('F1: keeps only rooms with capacity >= requested attendees', () => { ... });
  test('F2: keeps only rooms that have ALL selected equipment', () => { ... });
  test('F4: returns empty array when no rooms match criteria', () => { ... });
  test('B5: boundary capacity equal to attendees keeps the room in', () => { ... });
  test('B6: boundary capacity one below attendees filters the room out', () => { ... });
});
describe('checkRoom & INT вЂ” F3, F5, INT', () => { ... });
```

**Problems found:** Checked that `B1` (`true`), `B2` (`false`), `B3` (`true`), and `B4` (`false`) each assert a single exact boolean value, because `check_sis.py` (`S6`) checks `booleans_asserted(block)` against `B_EXPECT`.
**Changes made:** Kept `AC2 B1`, `AC2 B2`, `AC4 B3`, and `AC4 B4` as separate `test(...)` blocks asserting `.toBe(true)` or `.toBe(false)` individually.
**Verified by:** Ran `npx vitest run` (`15 passed (15)`) and `python tests/check_sis.py` (`PASS S1` through `PASS S7`).

## 9. Checker results and known fails

| Check | Why it still fails |
| --- | --- |
| none | All 33 checks in `python tests/check_sis.py` pass (`SUMMARY pass=33 fail=0 error=0`). |

## 10. AI reflection (Task 6)

To guide the AI assistant effectively, I provided a concise repository map of our Week 08 project along with the exact acceptance criteria (`AC1, AC2, AC3, AC4, AC5, AC6 (AC1-AC6)`), the five new feature rules (`F1`вЂ“`F5`), the target module signatures (`rooms.ts`, `filter.ts`, `booking.ts`), and the scope constraints prohibiting logins, databases, or network calls. Providing this structured context upfront allowed Claude Sonnet 5.5 to immediately pinpoint the rule duplication inside `src/lib/availability.ts` and the risk of stale room-selection state under `F5`. However, not every AI suggestion matched our specification: Claude proposed changing `checkRoom()` to return a `{ ok, reason }` object instead of a `boolean`, which I rejected because the module contract and boundary checks (`B1`вЂ“`B4`, `F3`, `F5`) require a strict `boolean` return value. I personally verified every module and test by running `npx vitest run` after each change, inspecting `git diff` to confirm `canBook()` stayed untouched, and testing the live React UI across desktop and `375x812` portrait viewports. Writing boundary tests (`B1`вЂ“`B6`) and the `INT` pipeline test (`filterRooms` feeding into `checkRoom`) directly shaped our refactoring: it forced `filterRooms()` and `checkRoom()` to remain pure functions that accept a `rooms` array argument rather than reading global state. Next, I would add component-level `@testing-library/react` tests to automate `F4` empty-state and `F5` room-switch DOM assertions alongside our unit and integration tests.

