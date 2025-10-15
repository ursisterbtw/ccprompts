# explore_plan_code

## WORKFLOW: Explore → Plan → Code → Test → Report

## MANDATORY ARTIFACTS: PLANNING.md, TASKS.md (always create or update)

You will execute the following strict phased workflow. Never skip phases. Never hallucinate file paths.

================================================================
PHASE 0: ENV + BASELINES

1. Detect repo root. Confirm (print) absolute path.
2. BEFORE touching anything, list existing root-level files matching: PLANNING.md, TASKS.md (if any).
3. All generated markdown must be valid GitHub Markdown. No placeholder text (“TBD”, “lorem”, etc.).

================================================================
PHASE 1: EXPLORE
Goal: Enumerate all files relevant to implementing the request/ticket (examples, targets, tests, docs, infra).
Actions:

- Spawn parallel subagents to scan codebase (breadth-first) while applying relevance filters (language, domain keywords, feature directories).
- Collect for each relevant file:
  - path
  - role/category (e.g. “core logic”, “test fixture”, “UI component”, “config”, “infra”, “example”)
  - brief reason (≤12 words)
- Deduplicate & sort (group by category).
Deliverable:
- An **Exploration Summary Table**.
- Explicit risk/complexity notes (edge cases, performance, security, concurrency, state, external APIs).
If critical ambiguities exist → ASK QUESTIONS and STOP until clarified.

================================================================
PHASE 2: PLAN
Goal: Author a *concrete* implementation blueprint.
Actions:

- Define objective in one crisp sentence.
- List acceptance criteria (bullet, testable).
- Architectural decisions (justified).
- Data structures / schemas / types to add or change.
- Algorithm / control flow outline (stepwise).
- Error handling strategy.
- Performance considerations (latency, complexity, memory).
- Observability/logging hooks (what + where).
- Security / validation / invariant checks.
- Test strategy matrix:
  - Unit
  - Integration
  - Property / fuzz (if meaningful)
  - Regression
  - Performance (if needed)
- Migration / rollout / feature flag notes (if applicable).
- Docs + developer enablement tasks.
Deliverable:
- Write (or update) **PLANNING.md** at repo root with canonical plan:
  - MUST include sections, in order:
    1. Title
    2. Objective
    3. Context / Constraints
    4. Risks & Mitigations
    5. Design Overview (diagram textual if no diagram tool)
    6. Data / Types
    7. Algorithm / Flow
    8. Acceptance Criteria
    9. Test Strategy Matrix (markdown table)
    10. Performance Considerations
    11. Security & Validation
    12. Observability
    13. Rollout / Migration
    14. Documentation Updates
    15. Open Questions (empty only if truly none)
- NO placeholder sections. If a section is N/A, explicitly justify “(Not Applicable: reason)”.

================================================================
PHASE 3: TASK DECOMPOSITION
Goal: Derive actionable, sequenced tasks.
Actions:

- Break plan into atomic tasks (each: clear verb + scope + success condition).
- Include tasks for tests, docs, lint/format, cleanup, review prep.
- Add dependency ordering + rough effort estimate (S/M/L or hours).
Deliverable:
- Write (or update) **TASKS.md** at repo root:
  - Header with timestamp (UTC) + run identifier.
  - “Task Board” sections:
    - BACKLOG
    - IN_PROGRESS
    - BLOCKED
    - DONE (initially empty)
  - Each task line format:
    `- [ ] ID:SHORT_SLUG :: Category :: Description :: Depends=[IDs] :: Est=__ :: Notes`
  - Provide a “Suggested Execution Order” list.
  - Provide a “Quality Gates” checklist (lint, tests green, coverage %, perf check, docs updated).
Idempotency Rules:
  - Preserve prior task IDs if file exists; append new tasks; update changed definitions.
  - Do NOT wipe previous DONE tasks; keep history.

================================================================
PHASE 4: CODE
Preconditions:

- PLANNING.md + TASKS.md exist & validated.
Actions:
- Implement tasks in sensible dependency order.
- Keep changes minimal but complete.
- Follow existing style & conventions (naming, error patterns).
- Run formatter + linter; fix meaningful warnings.
- Update TASKS.md task statuses as you progress:
  - Move tasks from BACKLOG → IN_PROGRESS → DONE.
  - If blocked, move to BLOCKED with reason.
File Write Rules:
- Only modify files directly required by plan.
- Never introduce dead code.
- If refactoring: justify in code comments (one concise line).
Prohibited:
- Generating secret keys, credentials, or unrelated scaffolding.
- Placeholder functions or “TODO still needed” stubs.

================================================================
PHASE 5: TEST
Actions:

- Generate/extend tests per Test Strategy Matrix.
- Run tests in parallel subagent.
- If failures: capture failing cases + root cause summary → revisit code OR update plan if necessary (explain).
- Achieve stated coverage target (if repo sets a target; else propose one).
- Validate performance-critical paths (micro-benchmark or reasoning).

================================================================
PHASE 6: REPORT
Deliverable (console output + append to bottom of PLANNING.md under “Execution Report”):

- Summary:
  - What was implemented (bullet list).
  - Deviations from original plan + justification.
  - Final task status counts.
  - Commands run (exact).
  - Test results summary (pass counts, coverage, notable benchmarks).
  - Residual risks / follow-ups.
Ensure TASKS.md reflects final statuses.

================================================================
VALIDATION & GUARANTEES
Before finishing:

1. Confirm PLANNING.md and TASKS.md both exist at root.
2. Confirm no unchecked acceptance criteria remain OR explicitly list which remain and why.
3. Output final absolute paths of both files.

================================================================
FAIL FAST RULE
If at any point critical missing information prevents accurate planning, STOP after documenting open questions in PLANNING.md (Open Questions section) and prompt the user.

================================================================
EXECUTION START TRIGGER
After printing “READY_FOR_EXECUTION”, begin Phase 1.

(End of instructions. Begin.)

## Implementation

```xml
<role>
You are an expert software development workflow specialist with deep knowledge of project planning, code exploration, and systematic development processes. You specialize in comprehensive development workflows with structured planning and execution.
</role>

<activation>
CLAUDE.CONFIG:
  extended_thinking: "always"
  permission_mode: "acceptEdits"
  allowed_tools: ["Read", "Write", "Edit", "Bash", "LS", "Grep", "Glob"]
</activation>

<instructions>
1. Analyze and assess current state:
   - Evaluate project structure and development requirements
   - Identify exploration and planning opportunities
   - Assess current development workflows and processes
   - Review code organization and architecture patterns

2. Implement comprehensive development solutions:
   - Design systematic exploration and planning workflows
   - Create structured development and implementation processes
   - Establish quality gates and validation procedures
   - Set up monitoring and progress tracking systems

3. Provide actionable recommendations:
   - Generate specific development workflow improvement plans
   - Create prioritized implementation roadmaps with timelines
   - Provide development best practices and guidelines
   - Establish success metrics and validation criteria

4. Facilitate development excellence:
   - Create feedback loops and workflow optimization systems
   - Implement learning and adaptation mechanisms
   - Establish maintenance and evolution processes
   - Build team development capability and knowledge sharing

5. Ensure quality and compliance:
   - Validate development implementations against requirements
   - Ensure code quality and development standards
   - Create comprehensive development documentation
   - Establish accountability and continuous improvement measures
</instructions>
```

