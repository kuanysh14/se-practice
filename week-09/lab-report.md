# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Olzhabay Kuanysh
**Student ID:** 24B031954
**GitHub:** kuanysh14

---

## 1. Setup

| |   |
| --- |---|
| Assistant (frozen for the whole lab) | Claude |
| Exact model (or "not displayed") | Sonnet 5.5 |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | 3.13.9 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Check whether a Smart Campus study room is available for a requested interval in whole minutes since midnight (0 to 1440) against acceptance criteria AC1-AC6. Returns Available or Unavailable and does not save or modify any booking.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking start time in whole minutes since midnight (0 to 1440, e.g. 10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested booking end time in whole minutes since midnight (0 to 1440, e.g. 24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time in whole minutes since midnight (0 to 1440)."
      },
      "blocked": {
        "type": "boolean",
        "description": "Whether the room is currently blocked for maintenance or other reasons."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings for the room as a list of {start, end} minute intervals; may be empty.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking start time in whole minutes since midnight (0 to 1440)."
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440,
              "description": "Existing booking end time in whole minutes since midnight (0 to 1440)."
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| `(root)` | `"type": "object"`, `"required": ["start", "end", "now", "blocked", "bookings"]`, `"additionalProperties": false` | The model could omit `now` (S04) or invent extra unsupported arguments like `"room": "204"` (S05) that `canBook` ignores. |
| `start` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Strings like `"10:00"`, fractional minutes like `600.5` (S10), negative values like `-30` (S06), or times past midnight would reach `canBook`. |
| `end` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | Clock strings like `"11:00"` (S03), fractional minutes, or values past day end like `1500` (S07) would pass schema validation. |
| `now` | `"type": "integer"`, `"minimum": 0`, `"maximum": 1440` | A missing `now` or a non-integer/out-of-range clock value could slip into `canBook` where `start > now` behaves unexpectedly on `NaN` or bad units. |
| `blocked` | `"type": "boolean"` | A string like `"false"` (S09) is truthy in JavaScript (`if ("false")` evaluates to `true`), which would wrongly reject unblocked rooms. |
| `bookings` | `"type": "array"`, `"items": { "type": "object", "properties": { "start": ..., "end": ... }, "required": ["start", "end"], "additionalProperties": false }` | Pair arrays like `[[660, 720]]` (S12) or incomplete objects missing `end` like `[{ "start": 660 }]` (S08) would be accepted by the schema and break overlap checks. |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- |---|
| S01 | PASS | PASS | Unchanged, valid R1 arguments already passed. |
| S02 | PASS | PASS | Unchanged, empty `bookings: []` is allowed. |
| S03 | FAIL | PASS | Added `"type": "integer"` on `end` so `"11:00"` is refused. |
| S04 | FAIL | PASS | Added `"now"` to root `"required"` so missing `now` is refused. |
| S05 | FAIL | PASS | Added `"additionalProperties": false` on root so extra `"room": "204"` is refused. |
| S06 | FAIL | PASS | Added `"minimum": 0` on `start` so `-30` is refused. |
| S07 | FAIL | PASS | Added `"maximum": 1440` on `end` so `1500` is refused. |
| S08 | FAIL | PASS | Added `"required": ["start", "end"]` on `bookings.items` so `{start: 660}` is refused. |
| S09 | FAIL | PASS | Added `"type": "boolean"` on `blocked` so `"false"` is refused. |
| S10 | FAIL | PASS | Added `"type": "integer"` on `start` so `600.5` is refused. |
| S11 | PASS | PASS | Unchanged, `"maximum": 1440` keeps `end = 1440` accepted. |
| S12 | FAIL | PASS | Added `"type": "object"` on `bookings.items` so `[660, 720]` is refused. |

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name": "check_room", "arguments": {"start": 600, "end": 660, "now": 540, "blocked": false, "bookings": [{"start": 660, "end": 720}]}}
```

Exact match: Claude converted `9:00` -> `540`, `10:00` -> `600`, `11:00` -> `660`, `12:00` -> `720`, set `blocked: false`, formatted `bookings` as `[{"start": 660, "end": 720}]`, and returned raw JSON with no code fence or extra prose (`F1`–`F3` all PASS).

### R2

```text
{"name": "check_room", "arguments": {"start": 840, "end": 990, "now": 810, "blocked": true, "bookings": []}}
```

Exact match: Claude correctly called `check_room` even though the room is blocked (`AC3`) and the duration is 150 minutes (`AC2`), converting `13:30` -> `810`, `14:00` -> `840`, `16:30` -> `990`, `blocked: true`, and `bookings: []` (`F4`–`F6` all PASS). It properly left the `Available`/`Unavailable` business decision to `canBook`.

### R3

```text
What exact start and end times do you want (e.g. 14:00 to 16:00), and is the room currently blocked? Also, what existing bookings does the room have for that day?
```

Claude followed the no-guessing instruction and asked a clarifying question instead of inventing arguments (`calls/r3.txt`, `F7` PASS). The request omitted `now` (current time), exact `start` and `end` ("tomorrow afternoon for a couple of hours"), `blocked` status, and existing `bookings`.

## 5. What the schema cannot check

- **AC1 (relational part `start < end` and `start > now`):** JSON Schema with the allowed keywords can enforce the single-field day bounds (`0 <= start <= 1440`, `0 <= end <= 1440`, `0 <= now <= 1440`, and whole integers), which is the part of AC1 the schema *can* check. However, it cannot compare two fields against each other (`start < end` or `start > now`), so `canBook` must reject reversed intervals (`750–720`) and past bookings (`start <= now`).
- **AC2 (maximum 120-minute duration):** JSON Schema cannot compute or bound the difference `end - start <= 120`, so `canBook` must enforce the 2-hour cap (such as rejecting `840–990` in R2).
- **AC3 (rejecting a blocked room):** The schema only verifies that `blocked` is a `boolean`; it cannot reject `blocked: true` as Unavailable without refusing the tool call itself.
- **AC4 (overlap with touching endpoints allowed):** JSON Schema cannot iterate over `bookings` and compare `start < b.end && end > b.start` across elements.
- **AC5 & AC6 (non-mutation and UI feedback):** A static input schema cannot verify that `canBook` leaves `bookings` unchanged or that the React UI renders readable validation messages on desktop and mobile.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | `check_room` is a read-only availability check with no side effects on repository files or booking state. |
| A2 | read `week-08/app/src/booking.ts` | allow | Reading a local source file is non-destructive and contains no secrets, so it carries negligible risk. |
| A3 | edit `booking.ts` to raise the 120-minute limit to 180 | block | Modifying production source code to bypass AC2 ("Enforce the maximum allowed duration (120 minutes)") violates the specification because a single user requested 3 hours. |
| A4 | run `npm test` in `week-08/app` | allow | Running the local Vitest suite executes project tests without mutating repository history or exposing credentials. |
| A5 | run `git reset --hard` to undo its own last three edits | block | `git reset --hard` is destructive and permanently wipes uncommitted working-tree changes, risking loss of the developer's own work. |
| A6 | `git commit` its change on the `week-09` branch | ask | Committing alters repository history on the active branch, so the developer should inspect `git diff` and approve the commit message first. |
| A7 | `git push` to `main` | block | Pushing directly to `main` bypasses code review and the open Pull Request workflow required by course rules. |
| A8 | send the contents of `.env` to an MCP server it found online | block | `.env` files hold secrets, API keys, and tokens; sending them to an untrusted third-party MCP server is a direct credential-exfiltration risk. |

## 7. Checkpoint

Before letting an agent edit any files, I would create a clean checkpoint commit on `week-09` (for example, Commit #2 `dd68a67` — `week-09: define check_room tool schema` from `git log --oneline`). If an agent makes unwanted edits, I can restore the working tree to that exact checkpoint with:

```powershell
git reset --hard dd68a67
```

That command throws away all uncommitted modifications to tracked files in the working tree and staging area since `dd68a67` (while leaving untracked files untouched unless `git clean` is also run).

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls\r1.json: a call to check_room
PASS  F2    calls\r1.json: arguments valid against your schema
PASS  F3    calls\r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls\r2.json: a call to check_room
PASS  F5    calls\r2.json: arguments valid against your schema
PASS  F6    calls\r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
```

## 9. What still fails

Nothing, all 30 checks in `tests/check_tool.py` pass (`30 PASS · 0 FAIL · 0 ERROR`).

## 10. Conclusion (80–150 words)

Working through `check_room` showed a clear boundary between what a JSON Schema, an LLM, and `canBook` each own. The schema catches structural and single-field errors—such as refusing `"11:00"` in `S03`, missing `now` in `S04`, extra `"room"` in `S05`, and `"false"` in `S09`—before `canBook` ever runs. However, cross-field business rules like `end - start <= 120` (AC2), `start > now` (AC1), and `blocked: true` (AC3) still belong inside `canBook`, which is why Claude rightly called `check_room` on `R2` (`840–990`, `blocked: true`) instead of refusing it, and asked for missing details on `R3`. Finally, holding a tool and terminal requires explicit guardrails: read-only actions (`A1`, `A2`, `A4`) are safe to `allow`, commits (`A6`) require `ask`, and destructive or exfiltrating actions (`A5`, `A7`, `A8`) must be `block`ed behind a git checkpoint.