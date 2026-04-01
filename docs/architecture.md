# Architecture — TaskFlow

## Vue d'ensemble

```mermaid
flowchart TD
    Browser(["🖥️ Navigateur"])

    subgraph WEB["Next.js — port 3001"]
        direction TB
        subgraph CLIENT["Client Components"]
            PageProjects["ProjectsPage\n/projects"]
            PageKanban["ProjectDetailPage\n/projects/:id\n(Kanban Board)"]
        end
        subgraph BFF["BFF — API Routes (serveur-side)"]
            BFFProjects["GET|POST /api/projects\nGET|DELETE /api/projects/:id"]
            BFFTasks["GET /api/tasks/project/:id\nPOST /api/tasks\nPATCH /api/tasks/:id/move\nDELETE /api/tasks/:id"]
        end
        CLIENT -->|"fetch /api/..."| BFF
    end

    subgraph API["NestJS — port 3000"]
        direction TB

        subgraph PRESENTATION["Presentation Layer (Adaptateurs entrants)"]
            PC["ProjectController\nPOST /v1/project\nGET /v1/project/:id\nDELETE /v1/project/:id"]
            TC["TaskController\nPOST /v1/task\nGET /v1/task/project/:id\nPATCH /v1/task/:id/move\nDELETE /v1/task/:id"]
        end

        subgraph APPLICATION["Application Layer (Use Cases)"]
            PS["ProjectService\ncreate() → project.created\naddMember() → member.added"]
            TS["TaskService\ncreate() → task.created\nmoveTask() → task.moved"]
        end

        subgraph DOMAIN["Domain Layer (Cœur métier — 0 dépendance framework)"]
            direction LR
            subgraph ENTITIES["Entités & Value Objects"]
                PE["Project\n+ addMember(userId)\n  → règle: pas de doublon"]
                TE["Task\n+ move(status)\n  → délègue à TaskStatus"]
                TS_VO["TaskStatus\n≪Value Object≫\nTodo → In Progress → Done"]
            end
            subgraph EVENTS["Domain Events"]
                E1["ProjectCreatedEvent"]
                E2["MemberAddedEvent"]
                E3["TaskCreatedEvent"]
                E4["TaskMovedEvent"]
            end
            subgraph PORTS["Ports (interfaces)"]
                PR["ProjectRepository"]
                TR["TaskRepository"]
                EP["EventPublisher"]
            end
            TE --> TS_VO
        end

        subgraph INFRASTRUCTURE["Infrastructure Layer (Adaptateurs sortants)"]
            direction LR
            TORM_P["TypeOrmProjectRepository\nimplements ProjectRepository"]
            TORM_T["TypeOrmTaskRepository\nimplements TaskRepository"]
            NEP["NestEventPublisher\nimplements EventPublisher"]
            subgraph EVENTBUS["Bus d'événements interne"]
                EE["EventEmitter2\n(wildcard: true)"]
                CL["ConsoleListener\n@OnEvent('task.created')\n@OnEvent('task.moved')\n→ log taskId + timestamp"]
            end
            NEP -->|"emit()"| EE
            EE --> CL
        end

        PC --> PS
        TC --> TS
        PS --> PE
        TS --> TE
        PS -->|"via EventPublisher port"| E1 & E2
        TS -->|"via EventPublisher port"| E3 & E4
        E1 & E2 & E3 & E4 -->|"publish()"| NEP
        PS -->|"via ProjectRepository port"| TORM_P
        TS -->|"via TaskRepository port"| TORM_T
    end

    subgraph DB["PostgreSQL"]
        T1[("typeorm_project\nid · projectName · members")]
        T2[("typeorm_task\nid · title · status · projectId · assigneeUserId")]
    end

    Browser -->|"HTTP"| WEB
    BFF -->|"HTTP /v1/... (API_INTERNAL_URL)"| PRESENTATION
    TORM_P -->|"TypeORM"| T1
    TORM_T -->|"TypeORM"| T2
```

## Flux d'un déplacement de tâche

```mermaid
sequenceDiagram
    actor User as Utilisateur
    participant Web as Next.js (BFF)
    participant API as NestJS API
    participant DB as PostgreSQL
    participant Bus as EventEmitter2
    participant Log as ConsoleListener

    User->>Web: Clic "Passer en In Progress"
    Web->>API: PATCH /v1/task/:id/move { status: "In Progress" }
    API->>DB: SELECT task WHERE id = :id
    DB-->>API: Task (status: "Todo")
    Note over API: task.move(IN_PROGRESS)<br/>TaskStatus valide la transition
    API->>DB: UPDATE task SET status = "In Progress"
    DB-->>API: Task mise à jour
    API->>Bus: emit("task.moved", { taskId, from, to })
    Bus->>Log: handleTaskMoved() → Logger.log(...)
    API-->>Web: Task { status: "In Progress" }
    Web-->>User: Kanban mis à jour
```

## Règles d'architecture

| Règle | Application |
|---|---|
| Le domaine ne dépend de rien | `task/domain/` et `project/domain/` : 0 import NestJS / TypeORM |
| Les services passent par des interfaces | `ProjectService` injecte `ProjectRepository` (interface), jamais `TypeOrmProjectRepository` |
| Les règles métier vivent dans les entités | Transitions `TaskStatus`, doublon membre `Project.addMember()` |
| Les services publient et oublient | `TaskService` émet `task.moved` sans connaître `ConsoleListener` |
| Le frontend ne connaît pas le backend | Les composants React appellent `/api/...` (BFF Next.js), jamais `localhost:3000` |
