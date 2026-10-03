# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- |---|
| Name | Olzhabay Kuanysh |
| Group | Monday (18:00-19:00) |
| AI assistant | Claude |
| Exact model | Claude-sonnet-5.5 |
| Renderer | PlantUML web server |
| Behaviour diagram | sequence |
| Stories used | my week-03 stories, revised |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
# Approved stories — Smart Campus study room booking

**Source of this set:** my Week 03 stories, revised after review (`week-03/requirements/user-stories.md`)

## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

- **R1** Future start, with duration greater than 0 and at most 2 hours.
- **R2** Active bookings for the same room cannot overlap.
- **R3** A blocked room cannot accept a new booking.
- **R4** A successful booking produces a confirmation.

## My stories

| ID | Story | Rules |
| --- | --- | --- |
| US-01 | As a Student, I want to view which rooms are free and when, so that I can choose a time slot without contacting library staff. | — |
| US-02 | As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed quiet space for study. | R1, R2, R3, R4 |
| US-03 | As a Student, I want to cancel a booking I made, so that I can release the room when my plans change. | R2 |
| US-04 | As an Administrator, I want to block a room that is out of service, so that students cannot book it while it's unusable. | R3 |
| US-05 | As an Administrator, I want to unblock a room, so that students can resume booking it once it's usable again. | R3 |
| US-06 | As an Administrator, I want to review room usage over a chosen period, so that I can see booking patterns and spot underused or overused rooms. | — |

**Out of scope** (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.

## Declared decisions (still undecided by the scenario)

- **Do touching bookings overlap?** (one ends at 12:00, the next starts at 12:00) — **Not an overlap.** Consistent with the Week 03 decision: back-to-back bookings are allowed under R2.
- **What happens to existing bookings when a room is blocked?** — **They are unaffected.** Blocking only prevents *new* bookings from being made (R3); it does not cancel or alter bookings that already exist. Consistent with Week 03's acceptance criterion for blocking a room with active future bookings.

This is the Smart Campus scenario, its rules R1-R4 and my approved user stories. I will ask you for several UML diagrams in PlantUML. Use only this scenario. Wait for my first request.

Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.

```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate PlantUML for Book room. Use Student, BookingService, and BookingRepository lifelines. Validate the supplied rules, then attempt the reservation. Show a successful confirmation and an unavailable-room alternative using alt. Label messages and replies. Explain new design components and all assumptions.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:** <one line each, or "the AI listed none" — that is a finding too>
1) Student and Administrator are separate roles with no generalization between them, and an administrator doesn't book or view availability in this scope.
2) Rule labels in the notes are for traceability only. They aren't separate use cases.
3) Per your declared decisions, back-to-back bookings are allowed, and blocking a room leaves existing bookings untouched, so Block Room has no link to Cancel Booking.
4) Items marked out of scope (payments, equipment, recurring bookings, waiting lists, other notifications, registration) are not modeled.
5) Any authentication needed to tell the two roles apart is not modeled, since user registration is out of scope.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem                                                                                                                                                                 | Rule or story | Fix                                                                                                                                                                                                                                                             |
| --- | --- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | Whole reply (no assumptions text) | Task 1's prompt explicitly required "list assumptions," but the reply contained only the `.puml` block, no stated reasoning for any modeling choice                     | prompt instruction, Task 1 | Assumptions were already declared independently in `approved-stories.md` (touching bookings, blocked-room effect), so nothing was lost — but the AI's silence here means every other choice in this diagram was unexplained by it and had to be checked by hand |
| 2 | Cancel Own Booking (US-03) → note "Rule: R2" | At first read, R2 ("active bookings for the same room cannot overlap") seems to govern booking *creation*, not cancellation, so the tag looked like a possible AI error | R2's own wording scopes itself to *active* bookings; cancelling is the action that removes a booking from "active" status, so it legitimately interacts with R2's overlap check | Kept unchanged, verified the tag is correct rather than assuming either the AI or my first instinct was right                                                                                                                                                   |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one Student makes 0..* Bookings | each Booking is made by exactly 1 Student | 1 / 0..* |
| Room — Booking | one Room is reserved by 0..* Bookings | each Booking is for exactly 1 Room | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: the original AI reply explained R2's enforcement only in its prose (`Booking.overlaps()`), with nothing on the diagram itself — added a `note` on the `Booking` class in the revision stating the rule, that it applies to ACTIVE bookings only, and that touching bookings are not an overlap.
- R1 (future start, ≤2h duration) and R3 (blocked room rejects booking) are not shown as notes — both are directly visible as typed attributes/operations instead (`startTime`/`endTime`/`/duration` on Booking; `blocked`/`isBlocked()` on Room), so a note would be redundant with what the diagram already states structurally.

### 4.3 Assumptions

- A1: Administrator is not a domain class — the requirements give it actions (block, unblock, review usage) but no data of its own, and nothing records who performed a block. It stays an actor only; would become a class if an audit trail were required.
- A2: Confirmation is an attribute (`confirmationCode` on Booking), not its own class — the scenario gives it no data beyond "a confirmation is produced," and it's not reused elsewhere.
- A3: What happens to existing bookings when a room is blocked — unaffected (declared in `approved-stories.md`); `block()` has no link to cancellation, consistent with that decision.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Booking class (R2 enforcement) | R2 was explained only in the AI's surrounding prose, not represented anywhere on the diagram itself — a reader of the image alone would never know R2 exists | R2 ("active bookings for the same room cannot overlap") | Added a UML `note` on `Booking` stating R2 explicitly, including the touching-bookings decision |
| 2 | Room.isAvailable() / Booking.overlaps() | Both methods appear to implement overlap-checking logic independently, risking duplicated or inconsistent comparison logic between the two | R2 | Documented in the new note that `isAvailable()` must delegate to `overlaps()` rather than reimplementing the comparison |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3A sequence - maps cleanly to a single alt structure for the success/unavailable split, and makes R1/R2/R3's individual guard conditions easy to inspect directly on the diagram.

**Design components added beyond the domain model:** `BookingService` - coordinates the multi-step workflow (validate R1, check R3/R2, create, save, reply) that no single domain class owns. `BookingRepository` - isolates persistence of Room and Booking lookups/saves from the service logic, a design component, not a domain concept, so it correctly stays out of the Task 2 class diagram.

| # | Element | Problem | Rule or story | Fix                                                                                                                                                                               |
| --- | --- | --- | --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | Inner `alt` guard: "room is blocked (R3) or overlaps an active booking (R2)" | Two distinct rules were merged into a single OR'd branch, so neither R2 nor R3 had its own individually-guarded path on the diagram | R2, R3 | Restructured into a three-way `alt`/`else`/`else`, giving R3 its own branch, R2 its own branch, and success its own branch - each rule is now independently visible and traceable |
| 2 | `BookingRepository.findActiveBookings()` returning only "overlapping" bookings | Silently reimplements overlap-detection inside the repository, contradicting Task 2's class diagram, which assigns overlap logic to `Booking.overlaps()` | R2; class diagram `Booking.overlaps()` (Task 2, finding 2) | Repository now returns the raw active set, and a note makes explicit that `Booking.overlaps()` - not the repository - judges the overlap, keeping the two diagrams consistent     |

---

## 6. AI critique

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | R1 never appears in class.puml, only R2 | Booking note | accept | True — only a R2 note existed. Added an R1 note on Booking (startTime in future, 0 < /duration <= 2h). |
| 2 | Declared decision 2 (blocking leaves existing bookings unchanged) appears in none of the three files | UC4 note; Room note | accept | True — it was only in lab-report.md prose, never on a diagram. Added to both the UC4 note and a Room note. |
| 3 | Parameter names differ: `start`/`end` on Student/Room operations vs. `startTime`/`endTime` on Booking and in the sequence | Student.bookRoom, Room.isAvailable | accept | Real inconsistency. Renamed every parameter to `startTime`/`endTime`. |
| 4 | Sequence calls `booking.overlaps(requested)` on a Booking that doesn't exist yet — it's created later in the same flow | sequence.puml, booking.overlaps() | accept | Correct — a pre-creation call to an uncreated object's method is incoherent. Changed `overlaps()` to take `(startTime, endTime)` directly, called on each existing ACTIVE booking instead. |
| 5 | Two different owners for the booking workflow: `Student.bookRoom()` in the class diagram vs. `BookingService.bookRoom()` in the sequence, with different parameters | Student, BookingService | accept | Real design conflict. Removed `bookRoom`/`cancelBooking` from Student — BookingService owns both workflows, matching the sequence diagram's own design. |
| 6 | `Student.name` and `Room.name` are not required by any story or rule | Student, Room | accept (documented, not deleted) | Fair under this lab's "justify every element" standard. Kept both fields but added a note marking them as a display-only assumption rather than silently leaving them unjustified. |
| 7 | `Booking ..> BookingStatus` dependency adds nothing since `status : BookingStatus` already shows the type | class.puml | accept | Redundant notation. Removed the arrow. |
| 8 | `Room.isAvailable()` is documented as the R2/R3 check, but the sequence never calls it — it checks `isBlocked()` and overlap separately | Room.isAvailable(), sequence.puml | accept, with a different fix than suggested | The AI's own fix here was actually right: keep the separate checks (the booking flow needs distinct failure reasons; a single boolean from `isAvailable()` would hide whether blocking or overlap caused the rejection), and just reword the class note so `isAvailable()` is explicitly scoped to US-01 (View availability) rather than claimed as what the booking flow uses. |
| 9 | R2 could race between the overlap check and `save()` — undrawn in the sequence | sequence.puml, R2 | reject | The AI flagged this itself as optional. It's already disclosed in Task 3's original assumptions ("save enforces R2 atomically... that race is not drawn separately"); drawing it would add a concurrency fragment the review questions never ask for, for a case already handled honestly in prose. |

---

## 7. Consistency table

## 7. Consistency table

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Room | Booking (startTime, /duration — note) | "R1 violated" / "R1 satisfied" alt guard; validateTimeSlot() |
| R2 | Book Room, Cancel Own Booking | Booking.overlaps(startTime, endTime) — note | "any booking.overlaps(...) is true (R2)" alt guard |
| R3 | Block Room, Unblock Room | Room.blocked, isBlocked() | "room is blocked (R3)" alt guard |
| R4 | Book Room | Booking.confirmationCode | confirmation(...) reply on the success path |
| US-01 | View Room Availability\n(US-01) | Room.isAvailable(startTime, endTime) | not modeled in the sequence (out of scope for Book Room) |
| US-02 | Book Room\n(US-02) | Student, Room, Booking | the full sequence diagram |
| US-03 | Cancel Own Booking\n(US-03) | Student, Booking.cancel() | not modeled in the sequence (Book Room only) |
| US-04 | Block Room\n(US-04) | Room.block() | not modeled in the sequence |
| US-05 | Unblock Room\n(US-05) | Room.unblock() | not modeled in the sequence |
| US-06 | Review Room Usage\n(US-06) | Booking (derived — note) | not modeled in the sequence |
---

## 8. Change log

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | No mention of what happens to existing bookings when a room is blocked | Added to the UC4 note: "existing bookings are unaffected when a room is blocked" | Declared decision 2 was missing from every diagram (critique #2) |
| 2 | class | `Booking ..> BookingStatus` dependency arrow; `+/duration` public; no R1 note; `overlaps(other : Booking)` | Arrow removed; `-/duration` private; R1 note added; `overlaps(startTime, endTime)` | Redundant notation, inconsistent visibility, missing rule, and an uncallable method signature (critique #1, #7, #10, #12) |
| 3 | class | `Student.bookRoom()` / `Student.cancelBooking()` as Student operations | Removed from Student; note states BookingService owns both workflows | Conflicted with the sequence diagram's own design, where BookingService runs the workflow (critique #8) |
| 4 | sequence | Inner alt merged R2 and R3 into one OR'd branch; guard referenced `booking.overlaps(requested)` on a not-yet-created Booking | Split into nested alts (R3 branch, then R2 branch, then success); overlap now checked via `checkOverlap()` calling each existing booking's `overlaps(startTime, endTime)` | Rules need individual guards to stay traceable (my own Task 3 review), and the original overlap call was logically incoherent (critique #7) |

---

## 9. Checker output

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
SQ1  PASS  Student, BookingService and BookingRepository lifelines present
SQ2  PASS  alt block with a guard on every branch (6 branches)
SQ3  PASS  validation happens before creation
SQ4  PASS  nothing is saved on a failure branch
SQ5  PASS  every message is labelled
SQ6  PASS  R1 (time range) is visible - checked or stated as a precondition
SQ7  PASS  R3 (blocked room) is visible
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  PASS  2 behaviour-diagram findings in §5
LR6  PASS  9 critique issues with a verdict
LR7  PASS  4 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story
CS4  PASS  every lifeline is a domain class or an explained design component

SUMMARY pass=37 fail=0 error=0
```

**FAILs I am keeping, and why:** none — UC9, CL3, FI2 and SQ4 all failed on earlier runs (stale files and a guard-wording false positive on the word "overlap") and were fixed before this final run, not kept.

---

## 10. Conclusion (120–180 words)

The sequence diagram was the one the AI got most wrong. Its inner alt merged R2 and R3 into a single OR'd guard, so a student could not be told whether a room was blocked or already taken. It also called booking.overlaps(requested) on a Booking that is only created later in the same flow, and its repository quietly decided overlap itself, contradicting the class diagram. The uncallable overlaps(other : Booking) signature is the error that would have reached the code: nothing could run the R2 check before a booking exists. The critique caught what I missed: R1 had no note on Booking, declared decision 2 (blocking leaves existing bookings alone) was on no diagram, start/end clashed with startTime/endTime, and two components both owned the booking workflow (Student.bookRoom versus BookingService). None of its claims was outright false, but I rejected its race-condition point (R2 between the check and save()) as outside what the review asks for and already stated in the assumptions.
