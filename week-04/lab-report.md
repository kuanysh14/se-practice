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
<paste>
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
<paste>
```

### 2.4 Focused correction prompts (if you sent any)

```text
<paste, or write "none">
```

### 2.5 Critique prompt

```text
<paste>
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
| <Student — Booking> | <one student makes 0..* bookings> | <each booking belongs to exactly 1 student> | <1 / 0..*> |
| <Room — Booking> | <...> | <...> | <...> |

### 4.2 Constraints the multiplicities cannot show

- R2: <how your diagram states it — which note, on which class>
- <any other rule that is not visible in multiplicities>

### 4.3 Assumptions

- A1: <an assumption you had to make — e.g. what happens to existing bookings when a room is blocked>
- <A2 ...>

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** <3A sequence / 3B activity — one sentence on why>

**Design components added beyond the domain model:** <name each one, e.g. `BookingService` —
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | <issue> | <element> | <accept / reject> | <your reason> |
| 2 | <issue> | <element> | <accept / reject> | <your reason> |
| 3 | <issue> | <element> | <accept / reject> | <your reason> |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | <use case> | <classes and attributes> | <message, guard or decision> |
| R2 | <use case> | <classes, note> | <message, guard or decision> |
| R3 | <use case> | <classes and attributes> | <message, guard or decision> |
| R4 | <use case> | <classes> | <message or action> |
| <US-01> | <Book room> | <Student, Booking, Room> | <message or action> |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | <use case> | <before> | <after> | <rule, story or notation reason> |
| 2 | <class> | <before> | <after> | <reason> |
| 3 | <sequence / activity> | <before> | <after> | <reason> |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
<paste the full output>
```

**FAILs I am keeping, and why:** <one line per check ID, or "none">

---

## 10. Conclusion (120–180 words)

<Which diagram did the AI get most wrong, and what exactly was wrong? Which error would have
reached the code if nobody had reviewed it? What did the critique find that you missed — and what
did it claim that was false? Be specific: "the AI got the multiplicities wrong" is worth nothing;
"the AI put 1..* on the Booking end, which says every room must already have a booking" is worth
everything.>
