# User stories — Smart Campus study room booking

### US-01
As a Student, I want to view which rooms are free and when, so that I can choose a time slot without contacting library staff.

**Priority:** High
**Assumption:** Availability shown reflects all current bookings and blocks in real time.

### US-02
As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed quiet space for study.

**Priority:** High
**Assumption:** The system rejects any slot that starts in the past, exceeds two hours, or overlaps an existing booking, and confirms success to the student.

### US-03
As a Student, I want to cancel a booking I made, so that I can release the room when my plans change.

**Priority:** Medium
**Assumption:** A student can cancel only their own bookings, only before the booking's start time, and receives confirmation once it's cancelled.

### US-04
As an Administrator, I want to block a room that is out of service, so that students cannot book it while it's unusable.

**Priority:** High
**Assumption:** A room can be blocked even if it has no active bookings at that moment.

### US-05
As an Administrator, I want to unblock a room, so that students can resume booking it once it's usable again.

**Priority:** High
**Assumption:** There is no minimum time a room must stay blocked before it can be unblocked.

### US-06
As an Administrator, I want to review room usage over a chosen period, so that I can see booking patterns and spot underused or overused rooms.

**Priority:** Medium
**Assumption:** Usage data is based only on booking records: counts, durations, and cancellations.
