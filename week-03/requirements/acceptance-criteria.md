# Acceptance criteria

**Assumptions**

- A booking that ends at the exact same time another one begins is NOT treated as an overlap — back-to-back bookings are allowed. This resolves the R3 open question.
- A booking of exactly two hours is allowed; only a duration longer than two hours is rejected. This resolves the R2 open question.
- Only the student who created a booking may cancel it, and only before its start time.
- A room can be blocked by an Administrator regardless of whether it currently has active bookings.
- Only Administrators may block a room; only Administrators may unblock one.

## US-02 — Book room

**AC-01:** Given a room is free for the requested slot, when a student books it for exactly two hours starting in the future, then the system creates the booking and shows a success confirmation (exactly two hours is allowed).

**AC-02:** Given a student selects a start time that has already passed, when they submit the booking, then the system rejects it with an error stating the slot must be in the future.

**AC-03:** Given a student selects a duration longer than two hours, when they submit the booking, then the system rejects it with an error stating the two-hour maximum.

**AC-04:** Given the room already has a confirmed booking that overlaps the requested slot, when a student tries to book it, then the system rejects the request and informs them the room is unavailable for that time.

**AC-05:** Given an existing booking for a room ends at a given time, when another student requests to book the same room starting at that exact time, then the system allows the new booking, since a booking ending when another begins is not an overlap.

## US-03 — Cancel booking

**AC-06:** Given a student has an upcoming booking that hasn't started, when they request to cancel it, then the system cancels the booking and confirms success.

**AC-07:** Given a booking belongs to another student, when a student tries to cancel it, then the system rejects the request with an authorization error.

**AC-08:** Given a booking's start time has already passed, when the owning student tries to cancel it, then the system rejects the cancellation, stating that started or past bookings can't be cancelled.

**AC-09:** Given a booking has already been cancelled, when the student tries to cancel it again, then the system rejects the duplicate action and informs them it's already cancelled.

## US-04 — Block or unblock room

**AC-10:** Given a room is currently available, when an administrator blocks it, then the system marks the room as blocked and confirms success.

**AC-11:** Given a room has active future bookings, when an administrator blocks it, then the system still marks it as blocked successfully (existing bookings are unaffected by this action alone).

**AC-12:** Given a user without administrator privileges, when they attempt to block a room, then the system rejects the request with an authorization error.

**AC-13:** Given a room is already blocked, when an administrator attempts to block it again, then the system informs them the room is already blocked and takes no duplicate action.

**AC-14:** Given a room is blocked, when a student attempts to book it, then the system rejects the booking and informs the student the room is out of service.
