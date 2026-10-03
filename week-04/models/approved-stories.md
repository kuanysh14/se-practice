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