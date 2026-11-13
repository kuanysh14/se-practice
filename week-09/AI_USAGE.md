# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- |---|---| --- |
| Claude | Claude Sonnet 5.5 | Part 2: writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| Google Gemini | Gemini 4 Hydrogen | explaining JSON Schema keywords (`additionalProperties`, `integer`), verifying `check_tool.py` checks, and structuring `lab-report.md` and `submission.yml` | `tool/check_room.json`, `lab-report.md`, `AI_USAGE.md`, `submission.yml` |

**I wrote `tool/check_room.json` myself:** yes
<!-- If an AI wrote or revised any of it, say which part, and how you checked it. -->

**I used an AI to explain a JSON Schema keyword or a check:** yes
<!-- If "yes" which one, and for what. -->
I used Google Gemini (`Gemini 4 Hydrogen`) to verify which JSON Schema keywords are supported by `tests/check_tool.py` (`additionalProperties: false`, `integer`, `minimum: 0`, `maximum: 1440`) and tested all 12 schema cases (`S01`–`S12`) locally.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
<!-- Name the file and the part. An honest entry here costs far less than a blank one that turns out to be untrue. -->
None, I reviewed every constraint in `tool/check_room.json`, ran `tests/check_tool.py` before and after defining the schema, and verified all three Claude replies in `calls/`.

Signed: Olzhabay Kuanysh
Date: 2026-11-13
