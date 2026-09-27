# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name:
Student ID:
GitHub username:

---

## 1. Setup

| |                 |
| --- |-----------------|
| AI assistant (tool) | Claude          |
| Exact model name and version | Claude Sonnet 5 |
| Date of the session | 27.09.2026      |
| Diagram renderer used |                 |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
**Student**

1. As a Student, I want to view which rooms are free and when, so that I can choose a time slot without contacting library staff.
 - Priority: High
 - Assumption: Availability shown reflects all current bookings and blocks in real time.

2. As a Student, I want to book a free room for a specific time slot, so that I have a guaranteed quiet space for study.
 - Priority: High
 - Assumption: The system rejects any slot that starts in the past, exceeds two hours, or overlaps an existing booking.

3. As a Student, I want to cancel a booking I made, so that I can release the room when my plans change.
 - Priority: Medium
 - Assumption: A student can cancel only their own bookings, and only before the booking's start time.

4. As a Student, I want to receive a confirmation when I book or cancel a room, so that I have clear proof of my reservation status.
 - Priority: Medium
 - Assumption: Confirmation is shown/delivered within the web application itself, not via SMS or push notification.

**Administrator**

5. As an Administrator, I want to block a room that is out of service, so that students cannot book it while it's unusable.
 - Priority: High
 - Assumption: A room can be blocked even if it has no active bookings at that moment.

6. As an Administrator, I want to unblock a room, so that students can resume booking it once it's usable again.
 - Priority: High
 - Assumption: There is no minimum time a room must stay blocked before it can be unblocked.

7. As an Administrator, I want to review room usage over a chosen period, so that I can see booking patterns and spot underused or overused rooms.
 - Priority: Medium
 - Assumption: Usage data is based only on booking records (counts, durations, cancellations), not attendance or check-in.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| | | | |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked".

**How many stories did you end with, and why that number?**

---

## 4. Original AI output — acceptance criteria (Part 3)

```
(paste here)
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| | | | |

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed / not-allowed | |
| Is exactly two hours allowed under R2? | allowed / not-allowed | |

**Which invalid or boundary case did the assistant leave out?**

---

## 6. Original AI output — use-case diagram (Part 4)

```
(paste the PlantUML source exactly as generated)
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| | | |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.

**Did any screen, database or internal component appear as a use case or an actor?**

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
(paste)
```

```
$ python tests/validate_submission.py
(paste)
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | | | |

Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said.

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
