# Traceability — use cases → stories → criteria

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | none | Yes — no acceptance criteria written for this story (only 3 of 6 stories were selected for Part 3) |
| UC-02 Book room | US-02 | AC-01, AC-02, AC-03, AC-04, AC-05 | none |
| UC-03 Cancel booking | US-03 | AC-06, AC-07, AC-08, AC-09 | none |
| UC-04 Block or unblock room | US-04, US-05 | AC-10, AC-11, AC-12, AC-13, AC-14 | Partial — criteria cover blocking only; US-05 (unblock) has no criteria of its own |
| UC-05 Review usage | US-06 | none | Yes — no acceptance criteria written for this story |
| UC-06 Send confirmation | US-02, US-03 (indirectly, via their assumptions — no dedicated story) | AC-01, AC-06 | Yes — no story independently owns this use case; it exists only as a consequence inside US-02/US-03 and is modeled with <<include>> in the diagram rather than a direct actor trigger |

**Stories that belong to no use case:** none

**What the gaps tell you:** The generated acceptance criteria concentrated on the three most rule-heavy stories (booking, cancelling, blocking) because those were the three selected for Part 3 — View availability, Review usage, and the unblock half of UC-04 were never asked for criteria, not because they're untestable. UC-06's gap is different in kind: it was never a story on its own, because it isn't something a person independently triggers — the diagram is the artifact that correctly represents this, not the story list.
