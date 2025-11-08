# Architecture and Workflow Visualization

This document provides visual representations of the GitHub Copilot Orchestra architecture and workflow.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (VS Code Insiders Chat)                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ User Request
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      CONDUCTOR AGENT                            │
│                  (Main Orchestration)                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Workflow Management:                                    │  │
│  │ • Planning Phase                                        │  │
│  │ • Implementation Cycles                                 │  │
│  │ • Review Coordination                                   │  │
│  │ • Commit Management                                     │  │
│  └─────────────────────────────────────────────────────────┘  │
└────┬─────────────────┬─────────────────┬──────────────────────┘
     │                 │                 │
     │ Delegate        │ Delegate        │ Delegate
     │                 │                 │
     ▼                 ▼                 ▼
┌─────────┐       ┌─────────┐       ┌─────────┐
│Planning │       │Implement│       │  Code   │
│Subagent │       │Subagent │       │ Review  │
│         │       │         │       │Subagent │
└────┬────┘       └────┬────┘       └────┬────┘
     │                 │                 │
     │ Research        │ TDD             │ Quality
     │ Context         │ Process         │ Check
     │                 │                 │
     ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CODE BASE                                │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │  Source  │  │  Tests   │  │   Docs   │  │  Plans   │      │
│  │  Files   │  │          │  │          │  │  Dir     │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

## Complete Workflow Cycle

```
                    ╔═══════════════════════╗
                    ║   START: User Request ║
                    ╚═══════════════════════╝
                              │
                              ▼
              ┌───────────────────────────────┐
              │   PHASE 1: PLANNING           │
              └───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   ┌────────┐          ┌──────────┐         ┌───────────┐
   │Research│          │  Create  │         │   User    │
   │Context │──────────│   Plan   │─────────│  Reviews  │
   │        │          │          │         │& Approves │
   └────────┘          └──────────┘         └─────┬─────┘
                                                   │
                                                   ▼
                                            ┌───────────┐
                                            │ Plan File │
                                            │ Created   │
                                            └─────┬─────┘
                                                  │
                ┌─────────────────────────────────┘
                │
                ▼
    ╔═══════════════════════════════════════════╗
    ║   FOR EACH PHASE IN PLAN (REPEAT)         ║
    ╚═══════════════════════════════════════════╝
                │
                ▼
    ┌───────────────────────────────┐
    │  STEP 1: IMPLEMENTATION       │
    └───────────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
    ▼           ▼           ▼
┌───────┐   ┌──────┐   ┌────────┐   ┌──────────┐
│ Write │   │ Run  │   │ Write  │   │   Run    │
│Failing│──▶│Tests │──▶│Minimal │──▶│  Tests   │
│ Tests │   │(Fail)│   │  Code  │   │  (Pass)  │
└───────┘   └──────┘   └────────┘   └────┬─────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │ Lint/Format  │
                                   └──────┬───────┘
                                          │
                                          ▼
                        ┌───────────────────────────────┐
                        │   STEP 2: CODE REVIEW         │
                        └───────────────────────────────┘
                                          │
                    ┌─────────────────────┼──────────────────────┐
                    │                     │                      │
                    ▼                     ▼                      ▼
           ┌─────────────┐      ┌──────────────┐      ┌──────────────┐
           │  APPROVED   │      │    NEEDS     │      │    FAILED    │
           │             │      │  REVISION    │      │              │
           └──────┬──────┘      └──────┬───────┘      └──────┬───────┘
                  │                    │                      │
                  │                    │                      │
                  │                    ▼                      ▼
                  │          ┌──────────────────┐   ┌──────────────────┐
                  │          │  Return to       │   │  Stop & Consult  │
                  │          │ Implementation   │   │      User        │
                  │          │  with Feedback   │   │                  │
                  │          └─────────┬────────┘   └──────────────────┘
                  │                    │
                  │                    └──────┐
                  │                           │
                  ▼                           │
    ┌───────────────────────────────┐        │
    │   STEP 3: COMMIT PHASE        │◀───────┘
    └───────────────────────────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
    ▼             ▼             ▼
┌─────────┐  ┌─────────┐  ┌──────────┐  ┌────────────┐
│ Present │  │  Write  │  │ Generate │  │    User    │
│ Summary │─▶│  Phase  │─▶│  Commit  │─▶│   Commits  │
│         │  │Complete │  │  Message │  │& Confirms  │
└─────────┘  └─────────┘  └──────────┘  └──────┬─────┘
                                                │
                                                │
                    ┌───────────────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  More Phases? │
            └───────┬───────┘
                    │
        ┌───────────┴───────────┐
        │                       │
       YES                     NO
        │                       │
        └───────┐               ▼
                │    ┌────────────────────────┐
                │    │  COMPLETION PHASE      │
                │    └────────────────────────┘
                │               │
                │               ▼
                │    ┌────────────────────────┐
                │    │  Generate Completion   │
                │    │  Report & Summary      │
                │    └────────────────────────┘
                │               │
                │               ▼
                │         ╔═══════════╗
                │         ║    END    ║
                │         ╚═══════════╝
                │
                └──────────────┘
                    (Loop back)
```

## Agent Interaction Sequence

```
Time ────────────────────────────────────────────────────────▶

User        Conductor      Planning       Implement      Review
 │              │              │              │             │
 │ Request      │              │              │             │
 ├─────────────▶│              │              │             │
 │              │              │              │             │
 │              │ Gather       │              │             │
 │              │ Context      │              │             │
 │              ├─────────────▶│              │             │
 │              │              │ Research     │             │
 │              │              ├─┐            │             │
 │              │              │ │ Search     │             │
 │              │              │ │ & Analyze  │             │
 │              │◀─────────────┤ │            │             │
 │              │   Findings   │◀┘            │             │
 │              │              │              │             │
 │              │ Create       │              │             │
 │              │ Plan         │              │             │
 │              ├─┐            │              │             │
 │              │ │            │              │             │
 │◀─────────────┤◀┘            │              │             │
 │  Present     │              │              │             │
 │  Plan        │              │              │             │
 │              │              │              │             │
 │ Approve      │              │              │             │
 ├─────────────▶│              │              │             │
 │              │              │              │             │
 │              │ Execute      │              │             │
 │              │ Phase        │              │             │
 │              ├──────────────┼─────────────▶│             │
 │              │              │              │ Write Tests │
 │              │              │              ├─┐           │
 │              │              │              │ │ TDD       │
 │              │              │              │ │ Cycle     │
 │              │              │              │◀┘           │
 │              │◀─────────────┼──────────────┤             │
 │              │              │    Done      │             │
 │              │              │              │             │
 │              │ Review       │              │             │
 │              │ Changes      │              │             │
 │              ├──────────────┼──────────────┼────────────▶│
 │              │              │              │             │ Analyze
 │              │              │              │             ├─┐
 │              │              │              │             │ │
 │              │◀─────────────┼──────────────┼─────────────┤◀┘
 │              │              │        Status: APPROVED    │
 │              │              │              │             │
 │              │ Generate     │              │             │
 │              │ Summary      │              │             │
 │              ├─┐            │              │             │
 │              │ │            │              │             │
 │◀─────────────┤◀┘            │              │             │
 │  Summary &   │              │              │             │
 │  Commit Msg  │              │             │             │
 │              │              │              │             │
 │ Git Commit   │              │              │             │
 │ & Continue   │              │              │             │
 ├─────────────▶│              │              │             │
 │              │              │              │             │
 │              └─ (Repeat for next phase) ──┘             │
```

## TDD Cycle Detail

```
    ┌────────────────────────────────────────────────┐
    │       Test-Driven Development Cycle            │
    └────────────────────────────────────────────────┘

                    START PHASE
                         │
                         ▼
               ┌──────────────────┐
               │  1. WRITE TESTS  │
               │     (RED)        │
               └─────────┬────────┘
                         │
                         │ Tests written
                         │ for new feature
                         │
                         ▼
               ┌──────────────────┐
               │  2. RUN TESTS    │
               │   (See Failure)  │
               └─────────┬────────┘
                         │
                         │ ❌ Tests MUST fail
                         │ (proving they work)
                         │
                         ▼
               ┌──────────────────┐
               │  3. WRITE CODE   │
               │     (GREEN)      │
               └─────────┬────────┘
                         │
                         │ Minimal code
                         │ to pass tests
                         │
                         ▼
               ┌──────────────────┐
               │  4. RUN TESTS    │
               │  (See Success)   │
               └─────────┬────────┘
                         │
                         │ ✅ Tests pass?
                         │
         ┌───────────────┴───────────────┐
         │                               │
        NO                              YES
         │                               │
         ▼                               ▼
   ┌──────────┐                 ┌──────────────┐
   │  DEBUG   │                 │ 5. REFACTOR  │
   │   CODE   │                 │   (CLEAN)    │
   └────┬─────┘                 └──────┬───────┘
        │                              │
        └──────┐                       │ Improve code
               │                       │ quality
               ▼                       │
         ┌──────────┐                  │
         │ Fix bugs │                  │
         │ & retry  │                  │
         └────┬─────┘                  │
              │                        ▼
              │              ┌──────────────────┐
              │              │ 6. LINT/FORMAT   │
              │              └────────┬─────────┘
              │                       │
              └───────────────────────┘
                                     │
                                     ▼
                              PHASE COMPLETE
                           (Ready for Review)
```

## File Structure During Workflow

```
Project Root
│
├── .agent.md files          (Agent configurations)
│   ├── Conductor.agent.md
│   ├── planning-subagent.agent.md
│   ├── implement-subagent.agent.md
│   └── code-review-subagent.agent.md
│
├── plans/                   (Generated documentation)
│   ├── task-name-plan.md              [Created after approval]
│   ├── task-name-phase-1-complete.md  [After phase 1 commit]
│   ├── task-name-phase-2-complete.md  [After phase 2 commit]
│   └── task-name-complete.md          [After all phases done]
│
├── src/                     (Your source code)
│   ├── [modified files]     [Changed during implementation]
│   └── [new files]          [Created during implementation]
│
└── tests/                   (Your test files)
    ├── [new tests]          [Written FIRST in TDD]
    └── [modified tests]     [Updated as needed]

Git Workflow:
─────────────
    Commit after Phase 1 ──┐
                           │
    Commit after Phase 2 ──┼── Clean git history
                           │
    Commit after Phase N ──┘
```

## State Machine: Phase Status

```
                    ┌─────────────┐
                    │   PLANNED   │
                    │  (In Plan)  │
                    └──────┬──────┘
                           │
                           │ Start implementation
                           │
                           ▼
                  ┌──────────────────┐
                  │ IMPLEMENTING     │◀────┐
                  │ (In Progress)    │     │
                  └────────┬─────────┘     │
                           │               │
                           │ Done          │ Needs
                           │               │ Revision
                           ▼               │
                  ┌──────────────────┐     │
                  │   REVIEWING      │     │
                  │ (Under Review)   │     │
                  └────┬───────┬─────┘     │
                       │       │           │
              APPROVED │       │ FAILED    │
                       │       │           │
            ┌──────────┘       └─────┐     │
            │                        │     │
            ▼                        ▼     │
    ┌──────────────┐         ┌───────────┴──┐
    │  COMMITTING  │         │   BLOCKED    │
    │ (Ready)      │         │ (Needs User) │
    └──────┬───────┘         └──────────────┘
           │
           │ User commits
           │
           ▼
    ┌──────────────┐
    │  COMPLETE    │
    │  (Done)      │
    └──────────────┘
```

## Quality Gates

```
    ┌─────────────────────────────────────────────────┐
    │              QUALITY GATES                      │
    └─────────────────────────────────────────────────┘

    Implementation Phase
    ────────────────────
         │
         ├─ ✓ Tests written first
         ├─ ✓ Tests fail initially
         ├─ ✓ Minimal code added
         ├─ ✓ Tests pass after code
         ├─ ✓ Linting passes
         └─ ✓ Formatting applied
         │
         ▼
    Code Review Phase
    ─────────────────
         │
         ├─ ✓ Code quality
         ├─ ✓ Test coverage
         ├─ ✓ Best practices
         ├─ ✓ No obvious bugs
         ├─ ✓ Error handling
         └─ ✓ Phase objective met
         │
         ▼
    Commit Phase
    ────────────
         │
         ├─ ✓ Review approved
         ├─ ✓ All tests passing
         ├─ ✓ No uncommitted changes from other work
         ├─ ✓ Commit message formatted
         └─ ✓ User approval
         │
         ▼
    NEXT PHASE or COMPLETE
```

## Communication Patterns

```
Synchronous (Wait for Response)          Asynchronous (Fire & Forget)
────────────────────────────────         ─────────────────────────────

User ──[Request]─────▶ Conductor         Conductor ──[Task]──▶ Implement
     ◀─[Response]─────                                         Subagent
                                                                   │
Conductor ─[Invoke]──▶ Subagent                                   │
          ◀[Result]───                                            │
                                                                  │
                                          (Subagent works         │
MANDATORY PAUSE POINTS:                    autonomously)          │
• After plan creation                                             │
• After each phase                        Conductor ◀──[Done]─────┘
• After completion
```

## Decision Flow: Review Status

```
                    ┌──────────────┐
                    │ Code Review  │
                    │  Complete    │
                    └──────┬───────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
       ┌─────────────┐           ┌─────────────┐
       │  APPROVED   │           │NOT APPROVED │
       └──────┬──────┘           └──────┬──────┘
              │                         │
              │                  ┌──────┴───────┐
              │                  │              │
              │                  ▼              ▼
              │          ┌──────────────┐  ┌────────┐
              │          │    NEEDS     │  │ FAILED │
              │          │  REVISION    │  │        │
              │          └──────┬───────┘  └───┬────┘
              │                 │              │
              │                 │              │
              │                 ▼              ▼
              │          ┌─────────────┐  ┌──────────────┐
              │          │ Return to   │  │ Stop & Ask   │
              │          │ Implement   │  │ User for     │
              │          │ with        │  │ Guidance     │
              │          │ Feedback    │  │              │
              │          └──────┬──────┘  └──────────────┘
              │                 │
              │                 └─────────┐
              │                           │
              │                           │
              ▼                           │
       ┌──────────────┐                  │
       │   Proceed    │◀─────────────────┘
       │   to Commit  │
       └──────────────┘
```

---

## Legend

```
┌─────────┐
│ Process │  = A step or action
└─────────┘

┌─────────┐
│ Agent   │  = An AI agent
└─────────┘

╔═══════════╗
║ Mandatory ║  = User approval required
╚═══════════╝

────────▶    = Flow direction
◀────────    = Return/Response

✓            = Success/Pass
❌           = Failure/Must fail (in TDD)

```

This visual guide helps understand the system's architecture and workflow at a glance!
