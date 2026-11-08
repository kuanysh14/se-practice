# Week 08 — Lab report

**Name:** Olzhabay Kuanysh
**Group:** Monday 18:00-19:00
**Date:** 2026-11-08

Fill in every section. **Do not delete, rename or renumber the headings.** The checker and the
grader find your answers by them. You can add rows to any table, but never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant I debugged with (tool) | Claude |
| Exact model (with its version, or `not displayed`) | Claude Sonnet 5.5 |
| Where the skill was installed (ChatGPT / Claude web / Claude Code / prompt-only simulation) | Claude web |
| Where I ran the tests (Bolt terminal / my computer / Codespace) | my computer |
| Vitest version (the `RUN  v…` line of a run) | 2.1.9 |
| Language of my booking module (`ts` or `js`) — the file I copied from `buggy/` | `ts` |

---

## 2. Task 1 — baseline, buggy code, failing tests

### 2.1 My Week 07 suite on my own code

The **real** output of your Week 07 suite, run in `week-08/app/` **before** you replace
anything. It should be green. If it is not, say why under the block.

```text
 npx vitest run

 RUN  v2.1.9 

 ✓ src/booking.test.ts (17)
   ✓ canBook (17)
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

 Test Files  1 passed (1)
      Tests  17 passed (17)
   Start at  10:35:12
   Duration  842ms (transform 48ms, setup 0ms, collect 46ms, tests 14ms, environment 0ms, prepare 328ms)
```

### 2.2 The same suite on the provided canBook

You copied the whole `canBook` function from `buggy/booking.ts` (or `.js`) over yours and changed
nothing else. This is the real output:

```text
 npx vitest run

 RUN  v2.1.9

 ❯ src/booking.test.ts (17)
   ❯ canBook (17)
     × T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     × T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     × T15 AC5: available request returns true and leaves bookings unchanged (660-720)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 3 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > T01 AC4: touching after existing booking is accepted (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:19:59
     17| describe('canBook', () => {
     18|   test('T01 AC4: touching after existing booking is accepted (660-720)', () => {
     19|     expect(canBook(makeParams({ start: 660, end: 720 }))).toBe(true);
       |                                                           ^
     20|   });
     21| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/3]⎯

 FAIL  src/booking.test.ts > canBook > T08 AC4: touching before existing booking is accepted (570-600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:47:59
     45| 
     46|   test('T08 AC4: touching before existing booking is accepted (570-600)', () => {
     47|     expect(canBook(makeParams({ start: 570, end: 600 }))).toBe(true);
       |                                                           ^
     48|   });
     49| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/3]⎯

 FAIL  src/booking.test.ts > canBook > T15 AC5: available request returns true and leaves bookings unchanged (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:92:29
     90|     const jsonBefore = JSON.stringify(params.bookings);
     91| 
     92|     expect(canBook(params)).toBe(true);
       |                             ^
     93| 
     94|     expect(params.bookings).toBe(originalRef);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/3]⎯

 Test Files  1 failed (1)
      Tests  3 failed | 14 passed (17)
   Start at  10:39:35
   Duration  814ms (transform 42ms, setup 0ms, collect 43ms, tests 13ms, environment 0ms, prepare 313ms)
```

### 2.3 One failing test per bug

Add the two regression tests from README Part 1, step 5: one named `BUG-A` and one named `BUG-B`.
Run them **on the buggy code**. Both must fail here. That is the evidence that each test can see
its bug.

```text
 npx vitest run

 RUN  v2.1.9 

 ❯ src/booking.test.ts (19)
   ❯ canBook (19)
     × T01 AC4: touching after existing booking is accepted (660-720)
     ✓ T02 AC1: starting exactly at now is rejected (540-570)
     ✓ T03 AC1: zero-duration interval is rejected (720-720)
     ✓ T04 AC1: reversed interval is rejected (750-720)
     ✓ T05 AC1: interval ending past day end is rejected (1380-1441)
     ✓ T06 AC2: exactly 120 minutes is accepted (720-840)
     ✓ T07 AC2: 121 minutes is rejected (720-841)
     × T08 AC4: touching before existing booking is accepted (570-600)
     ✓ T09 AC4: partial overlap is rejected (630-690)
     ✓ T10 AC4: interval containing existing booking is rejected (570-690)
     ✓ T11 AC4: interval inside existing booking is rejected (615-645)
     ✓ T12 AC4: identical interval is rejected (600-660)
     ✓ T13 AC3: blocked room is rejected (660-720, blocked)
     ✓ T14 AC4: empty bookings list has no overlaps (630-690)
     ✓ X1 AC1: starting 1 minute after now is accepted (541-571)
     ✓ X2 AC4: overlapping only the second of two bookings is rejected (720-780)
     × T15 AC5: available request returns true and leaves bookings unchanged (660-720)
     × BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
     × BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 5 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/booking.test.ts > canBook > T01 AC4: touching after existing booking is accepted (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:19:59
     17| describe('canBook', () => {
     18|   test('T01 AC4: touching after existing booking is accepted (660-720)', () => {
     19|     expect(canBook(makeParams({ start: 660, end: 720 }))).toBe(true);
       |                                                           ^
     20|   });
     21| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/5]⎯

 FAIL  src/booking.test.ts > canBook > T08 AC4: touching before existing booking is accepted (570-600)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:47:59
     45| 
     46|   test('T08 AC4: touching before existing booking is accepted (570-600)', () => {
     47|     expect(canBook(makeParams({ start: 570, end: 600 }))).toBe(true);
       |                                                           ^
     48|   });
     49| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[2/5]⎯

 FAIL  src/booking.test.ts > canBook > T15 AC5: available request returns true and leaves bookings unchanged (660-720)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:92:29
     90|     const jsonBefore = JSON.stringify(params.bookings);
     91| 
     92|     expect(canBook(params)).toBe(true);
       |                             ^
     93| 
     94|     expect(params.bookings).toBe(originalRef);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[3/5]⎯

 FAIL  src/booking.test.ts > canBook > BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ❯ src/booking.test.ts:106:69
    104|       { start: 700, end: 760 },
    105|     ];
    106|     expect(canBook(makeParams({ start: 660, end: 700, bookings }))).toBe(true);
       |                                                                     ^
    107|   });
    108| 

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[4/5]⎯

 FAIL  src/booking.test.ts > canBook > BUG-B AC5: non-touching available request returns true without mutating bookings (720-780)
AssertionError: expected [ { start: 600, end: 660 }, …(1) ] to deeply equal [ { start: 600, end: 660 } ]

- Expected
+ Received

  Array [
    Object {
      "end": 660,
      "start": 600,
    },
+   Object {
+     "end": 780,
+     "start": 720,
+   },
  ]

 ❯ src/booking.test.ts:116:29
    114|     expect(canBook(params)).toBe(true);
    115| 
    116|     expect(params.bookings).toEqual(snapshot);
       |                             ^
    117|     expect(JSON.stringify(params.bookings)).toBe(jsonBefore);
    118|     expect(params.bookings).toHaveLength(1);

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[5/5]⎯

 Test Files  1 failed (1)
      Tests  5 failed | 14 passed (19)
   Start at  11:26:00
   Duration  1.04s (transform 67ms, setup 0ms, collect 52ms, tests 16ms, environment 0ms, prepare 127ms)
```

---

## 3. Defect log

One row per defect. At least **BUG-A and BUG-B**. "Suspected cause" is your hypothesis
**before** you ask any assistant: the line and why.

| Defect | Test ID | Input | Expected | Actual | Suspected cause (line and why) |
| --- | --- | --- | --- | --- | --- |
| BUG-A | `T01`, `T08`, `BUG-A` | `start = 660, end = 700, now = 540, blocked = false, bookings = [{ start: 600, end: 660 }, { start: 700, end: 760 }]` | `true` (touching endpoints allowed by AC4) | `false` | Line `if (start <= b.end && end >= b.start) return false;` uses inclusive `<=` and `>=` comparisons instead of strict `<` and `>`, so touching at minute 660 or 700 is treated as an overlap; this also causes `T15 AC5` (`660–720`) to fail early at `toBe(true)` before reaching the mutation check. |
| BUG-B | `BUG-B` (and `T15 AC5` after BUG-A is fixed) | `start = 720, end = 780, now = 540, blocked = false, bookings = [{ start: 600, end: 660 }]` | `true` and `bookings` remains `[{ start: 600, end: 660 }]` (AC5) | `true`, but `bookings` becomes `[{ start: 600, end: 660 }, { start: 720, end: 780 }]` | Line `bookings.push({ start, end });` right before `return true;` mutates the caller's `bookings` array in place whenever a slot is free, violating AC5's read-only requirement. |

---

## 4. Tasks 2–3 — the skill

**The checks from the deck, before you zip it.** Answer each one yes / no:

| Check | yes / no |
| --- | --- |
| The file is plain UTF-8 text, named exactly `SKILL.md` (not `SKILL.md.txt`) | yes |
| The first and the closing YAML delimiter are exactly three hyphens: `---` | yes |
| `name` is lowercase with hyphens, and `description` says WHEN to use it | yes |
| I read the whole file once: no passwords, API keys or private student data | yes |

**The contents of `skills/bug-detector.zip`.** Paste the listing (Windows: open the ZIP and copy
the paths; macOS/Linux: `unzip -l skills/bug-detector.zip`):

```text
Archive:  skills/bug-detector.zip
  Length      Date    Time    Name
---------  ---------- -----   ----
      570  2026-11-08 11:30   bug-detector/SKILL.md
---------                     -------
      570                     1 file
```

**Installation.** Where you uploaded it, what the upload said, and whether a new chat showed the
skill as enabled. If upload was not available, write `prompt-only simulation` and say why.
Screenshot of the result: `evidence/install.png`.

<!-- Write below this line -->

I uploaded `skills/bug-detector.zip` in Claude web under the Skills settings page (`Skills → Yours → + Add`). Claude validated the YAML frontmatter and `bug-detector/SKILL.md` structure with no errors, listed `bug-detector` under my created skills ("Created by you: 1") with its description, and enabled it for new chats, as captured in `evidence/install.png`.

---

## 5. Task 4 — without the skill

A **fresh chat, with no skill enabled**. Paste exactly what you sent: the deck's question, then
the same input you will use in section 6 (AC1–AC6, the failing test output, the code of
`canBook`):

```text
Find the root cause of the failed room-booking test. Propose minimal patch and regression test. Do not edit code.

Acceptance Criteria:
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output:
FAIL  src/booking.test.ts > canBook > T01 AC4: touching after existing booking is accepted (660-720)
AssertionError: expected false to be true // Object.is equality
  18|   test('T01 AC4: touching after existing booking is accepted (660-720)', () => {
  19|     expect(canBook(makeParams({ start: 660, end: 720 }))).toBe(true);

FAIL  src/booking.test.ts > canBook > T15 AC5: available request returns true and leaves bookings unchanged (660-720)
AssertionError: expected false to be true // Object.is equality
  92|     expect(canBook(params)).toBe(true);

Code (src/booking.ts):
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
Two separate defects in `canBook` explain the two failures.

**Root cause**

1. **Overlap check is inclusive (T01, AC4).** The condition `start <= b.end && end >= b.start` treats a shared endpoint as an overlap. With an existing booking ending at 660, a request for 660-720 satisfies `start <= b.end` (660 <= 660), so it is rejected. Touching bookings must be allowed, so both comparisons need to be strict.

2. **Side effect in a query function (T15, AC5).** `bookings.push({ start, end })` mutates the caller's array when the slot is free. The function is meant to answer Available / Unavailable only. The test's "unchanged bookings" assertion fails because of this push. (The failure output shows `expected false to be true` at the `canBook` call on line 92, which is consistent with the same overlap bug: the push on an earlier call or the inclusive check can produce a false there. Fixing both removes the dependency between calls.)

**Minimal patch**

   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }
-  // keep the room's list current with the slot that was just found free
-  bookings.push({ start, end });
   return true;

Two edits: strict comparisons, and delete the push. If some caller relied on the push to record the booking, that caller should add the booking itself in a separate step (for example a `book()` function or the UI handler), keeping `canBook` pure.

**Regression tests**

describe('canBook regressions', () => {
  test('AC4: touching before existing booking is accepted', () => {
    expect(canBook(makeParams({ start: 540, end: 600, bookings: [{ start: 600, end: 660 }] }))).toBe(true);
  });

  test('AC4: touching after existing booking is accepted', () => {
    expect(canBook(makeParams({ start: 660, end: 720, bookings: [{ start: 600, end: 660 }] }))).toBe(true);
  });

  test('AC4: one-minute overlap is still rejected', () => {
    expect(canBook(makeParams({ start: 659, end: 720, bookings: [{ start: 600, end: 660 }] }))).toBe(false);
  });

  test('AC5: available result does not mutate bookings', () => {
    const bookings = [{ start: 600, end: 660 }];
    const snapshot = structuredClone(bookings);
    expect(canBook(makeParams({ start: 660, end: 720, bookings }))).toBe(true);
    expect(bookings).toEqual(snapshot);
  });

  test('AC5: repeated calls give the same answer', () => {
    const params = makeParams({ start: 660, end: 720, bookings: [{ start: 600, end: 660 }] });
    expect(canBook(params)).toBe(true);
    expect(canBook(params)).toBe(true);
  });
});

The last test is the one that would have caught the push: before the fix, the second call returns false because the first call inserted the same slot.

**Other criteria**

AC1-AC3 are handled correctly by the existing guards, and the patch doesn't touch them. AC6 is UI-only and not affected by this change, though if the UI currently depended on the push to refresh its list, it should update its own state after a confirmed booking.

I haven't changed any files, as requested.
```

---

## 6. Task 5 — with the skill

**Another fresh chat, with `bug-detector` enabled.** Send exactly the same input as in section 5.
Only the question changes, to the deck's skill question:

```text
Use the bug-detector skill to diagnose the failed room-booking test.

Acceptance Criteria:
AC1 Reject start >= end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Preserve clear UI feedback on desktop and mobile.

Failing test output:
FAIL  src/booking.test.ts > canBook > T01 AC4: touching after existing booking is accepted (660-720)
AssertionError: expected false to be true // Object.is equality
  18|   test('T01 AC4: touching after existing booking is accepted (660-720)', () => {
  19|     expect(canBook(makeParams({ start: 660, end: 720 }))).toBe(true);

FAIL  src/booking.test.ts > canBook > T15 AC5: available request returns true and leaves bookings unchanged (660-720)
AssertionError: expected false to be true // Object.is equality
  92|     expect(canBook(params)).toBe(true);

Code (src/booking.ts):
export function canBook({ start, end, now, blocked, bookings }: {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: { start: number; end: number }[];
}): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start <= b.end && end >= b.start) return false;
  }
  // keep the room's list current with the slot that was just found free
  bookings.push({ start, end });
  return true;
}
```

**The assistant's answer, pasted unedited:**

```text
# Bug diagnosis: `canBook`

**Smallest reproduction:** existing booking `{600, 660}`, request `start=660, end=720`, `now` earlier, not blocked. The expected result is `true`, but it returns `false`.

## Confirmed defects

| # | Defect | Evidence | Root cause | Fix | Regression test |
|---|---|---|---|---|---|
| 1 | Bookings that only touch at an endpoint are rejected (AC4) | T01 fails. Trace: `660 <= 660 && 720 >= 600` is true, so it returns `false`. T15 fails for the same reason. | The overlap check uses inclusive comparisons (`<=`, `>=`), so shared endpoints count as overlap. | Use strict comparisons: `if (start < b.end && end > b.start) return false;` | With `{600,660}` booked, `660-720` returns `true`. Also check that `540-600` returns `true` and `630-690` returns `false`. |
| 2 | The availability check changes booking data (AC5) | `bookings.push({ start, end })` runs before `return true`. The comment says the list is kept "current", but the function is only meant to answer Available / Unavailable. | A side effect in what should be a pure query. The caller's array is mutated. | Delete the `push`. If a booking needs recording, do it in a separate `book()` function. | Snapshot with `structuredClone(bookings)`, call `canBook`, then `expect(bookings).toEqual(snapshot)`. Calling it twice with the same slot must return `true` both times. |

**Note on #2:** the failing output only shows line 92 (`toBe(true)`), which is explained by defect 1. The mutation is confirmed by reading the code, not by the test output. It would probably show up as a second failure in T15 once defect 1 is fixed, if the test asserts that bookings are unchanged. Without fix 2, a repeated check of the same slot would also return `false`, because the first call adds it to the list.

## Hypotheses, not confirmed

- **AC1 boundary:** `start > now` rejects `start === now`. Whether a request starting exactly now counts as "in the past" depends on the spec, so please check it against a test.
- **AC6:** this is UI feedback and can't be assessed from `booking.ts`.

## Checked and fine

- AC1 range and order check: `0 <= start < end <= 1440`.
- AC2: `end - start > 120` correctly allows exactly 120 minutes.
- AC3: the `blocked` check.

## Suggested minimal patch (not applied)

for (const b of bookings) {
  if (start < b.end && end > b.start) return false;
}
return true; // no bookings.push

I haven't edited any code, as the skill asks. I can apply the patch and add the regression tests if you'd like.
```

Did the environment show that the skill was invoked? yes

---

## 7. Comparison — judged against the actual code

Do not assume the skill did better. Judge both answers against the code and against what your
tests showed. Write a short verdict in each cell, and give a reason where they differ.

| Criterion | No skill | With skill |
| --- | --- | --- |
| Correct root cause | Found both `start <= b.end && end >= b.start` (BUG-A) and `bookings.push({ start, end })` (BUG-B), but falsely claimed `T15`'s unchanged-bookings assertion failed when `T15` actually stopped at line 92 (`toBe(true)`). | Found both BUG-A and BUG-B and accurately noted that `T15`'s failure at line 92 was caused by BUG-A while BUG-B was confirmed by reading `bookings.push` in the code. |
| Reproducible test | Proposed 5 Vitest tests, but its touching-before test used `start: 540` (which fails AC1 when `now = 540`) and its AC5 test used `660–720` (where BUG-A hides BUG-B on the unpatched code). | Gave a concise deterministic reproduction (`{600, 660}` with `660–720`), though it also proposed `540–600` (which fails AC1 at `now = 540`) and did not pick a non-touching slot like `720–780` for BUG-B. |
| Minimal proposed patch | Proposed the exact 2-line minimal diff: changing `<=` / `>=` to `<` / `>` and deleting `bookings.push({ start, end })` without editing files. | Proposed the exact same minimal 2-line change (`if (start < b.end && end > b.start) return false;` and removing `bookings.push`) without editing code. |
| Unsupported claims | Claimed that "the push on an earlier call" could make line 92 fail across tests (false, because `makeParams()` creates a fresh `bookings` array per test) and that `T15`'s mutation check ran and failed. | Made no false claims about `T15` or shared state; followed Step 4 by placing `start === now` (AC1) and UI behavior (AC6) under "Hypotheses, not confirmed". |
| Clarity of explanation | Clear prose and `diff` block, but mixed confirmed test evidence with speculation about why line 92 failed in `T15`. | Higher clarity: followed Step 7's `Defect | Evidence | Root cause | Fix | Regression test` table and separated confirmed defects from unconfirmed hypotheses. |

**Which bugs did each answer find?** (BUG-A, BUG-B, both, neither)

- Both answers found **both** (`BUG-A` and `BUG-B`), though only the **With skill** answer correctly explained that `T15` failed on line 92 due to `BUG-A` hiding `BUG-B`.

---

## 8. Task 6 — repair and regression

Review the proposed patch yourself, then make **one minimal change per bug**, one commit each.
Rerun the test that was failing, then the full suite.

### 8.1 The BUG-A patch

The change as a diff (`git diff`, or the old and the new line), then the real run:

```text
diff --git a/week-08/app/project/src/booking.ts b/week-08/app/project/src/booking.ts
--- a/week-08/app/project/src/booking.ts
+++ b/week-08/app/project/src/booking.ts
@@ -23,3 +23,3 @@ export function canBook({ start, end, now, blocked, bookings }: {
   for (const b of bookings) {
-    if (start <= b.end && end >= b.start) return false;
+    if (start < b.end && end > b.start) return false;
   }

PS C:\Users\user\PycharmProjects\se-practice\week-08\app\project> npx vitest run -t "BUG-A"

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-08/app/project

 ✓ src/booking.test.ts (19)
   ✓ canBook (19)
     ✓ BUG-A AC4: interval touching existing bookings on both sides is accepted (660-700)

 Test Files  1 passed (1)
      Tests  1 passed | 18 skipped (19)
   Start at  11:58:10
   Duration  785ms (transform 44ms, setup 0ms, collect 45ms, tests 4ms, environment 0ms, prepare 302ms)
```

### 8.2 The BUG-B patch and the final run

The change as a diff, then the real output of the **full** suite. Every test must pass.

```text
diff --git a/week-08/app/project/src/booking.ts b/week-08/app/project/src/booking.ts
--- a/week-08/app/project/src/booking.ts
+++ b/week-08/app/project/src/booking.ts
@@ -26,3 +26,2 @@ export function canBook({ start, end, now, blocked, bookings }: {
-  bookings.push({ start, end });
   return true;
 }

PS C:\Users\user\PycharmProjects\se-practice\week-08\app\project> npx vitest run

 RUN  v2.1.9 C:/Users/user/PycharmProjects/se-practice/week-08/app/project

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
   Start at  11:59:42
   Duration  812ms (transform 45ms, setup 0ms, collect 44ms, tests 15ms, environment 0ms, prepare 310ms)
```

---

## 9. What still fails, and what AI-assisted debugging cannot do

### 9.1 Checks I am keeping as FAIL or ERROR

Use the same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | All 31 automated checks in `tests/check_debugging.py` pass with 0 failures and 0 errors. |

### 9.2 One limitation of AI-assisted debugging

<!-- Use something that actually happened in sections 5-8. 20 words or more. -->
- Because the assistant only sees the snippet pasted into the prompt and cannot inspect or execute `booking.test.ts`, both the plain prompt and the `bug-detector` skill proposed `540–600` as a valid touching-before test case, overlooking that the suite's default fixture sets `now = 540` where `start = 540` is rejected by AC1 (`start > now`).

---

## 10. Conclusion (80–150 words)

<!-- Answer both, in your own words, without the assistant (3-5 sentences, as the deck asks):
     (a) Did the skill help? Show it with one row of section 7.
     (b) What did your tests actually prove - and what did they not?
     Worthless: &quot;The skill made the AI much better at debugging.&quot;
     Worth everything: &quot;Both answers found BUG-A from the T01 failure. Only the skill answer
     separated BUG-B as a hypothesis instead of a fact, because step 4 told it to. BUG-B was only
     visible after the BUG-A patch: the AC5 test had been failing for the wrong reason.&quot; -->

<!-- Write your conclusion below this line -->

The `bug-detector` skill helped most on the **Unsupported claims** and **Correct root cause** rows of Section 7: while the plain prompt falsely claimed that `T15`'s unchanged-bookings assertion failed (or was affected by an earlier test's `push`), the skill's Step 4 ("Separate confirmed defects from hypotheses") led Claude to state that `T15` failed at line 92 solely because of `BUG-A`, and that `BUG-B` (`bookings.push`) would only surface in `T15` after `BUG-A` was fixed. In our initial Week 07 suite, `T15 AC5` used the touching interval `660–720`, so `BUG-A` rejected the request before `bookings.push` ever ran. Adding regression test `BUG-B` on the non-touching slot `720–780` proved that `canBook` was mutating `bookings` independently of `BUG-A`, and our final 19-test green run proves both one-line fixes work without regression, though unit tests still cannot verify AC6's browser UI layout.
