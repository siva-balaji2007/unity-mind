# UnityMind Backend

UnityMind is a simple monolithic SaaS backend for Unity developers. A Unity editor plugin syncs project metadata, the backend indexes scripts/scenes/prefabs/dependencies in PostgreSQL + pgvector, and chat uses retrieval-augmented generation instead of sending a whole Unity project to the model.

## Stack

- Java 21
- Spring Boot 3
- Spring Web, Spring Data JPA, Spring Security, Validation
- PostgreSQL with `pgvector`
- JWT + BCrypt
- OpenAI API integration isolated in `OpenAIClientService`
- Maven

## Run Locally

1. Start a pgvector-enabled PostgreSQL database:

```bash
docker compose up -d
```

The compose file maps Postgres to local port `5433` so it does not conflict with a normal local PostgreSQL install.

2. Set environment variables:

```bash
DB_URL=jdbc:postgresql://localhost:5433/unitymind
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=replace-with-at-least-32-byte-secret
OPENAI_API_KEY=sk-...
```

3. Start the app:

```bash
mvn spring-boot:run
```

## Folder Structure

```text
src/main/java/com/unitymind
  auth/        register, login, current user endpoints
  chat/        RAG chat sessions and messages
  common/      shared enums/constants
  embedding/   OpenAI embeddings and pgvector lookup
  exception/   global JSON error handling
  prefab/      prefab entity/repository/controller
  project/     project CRUD, sync, dependency graph
  scene/       scene entity/repository/controller
  script/      script entity/repository/controller
  search/      full-text + vector search
  security/    JWT filter/config/current user
  user/        user entity/repository/mapper
```

## Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    PROJECT ||--o{ SCRIPT : contains
    PROJECT ||--o{ SCENE : contains
    PROJECT ||--o{ PREFAB : contains
    PROJECT ||--o{ DEPENDENCY : maps
    PROJECT ||--o{ EMBEDDING : indexes
    PROJECT ||--o{ CHAT_SESSION : has
    CHAT_SESSION ||--o{ CHAT_MESSAGE : contains

    USER {
      uuid id
      string name
      string email
      string password
      timestamptz created_at
      timestamptz updated_at
    }
    PROJECT {
      uuid id
      string name
      string unity_version
      timestamptz last_sync_at
      uuid user_id
    }
    SCRIPT {
      uuid id
      string name
      string path
      text content
      uuid project_id
    }
    SCENE {
      uuid id
      string name
      string path
      uuid project_id
    }
    PREFAB {
      uuid id
      string name
      string path
      uuid project_id
    }
    DEPENDENCY {
      uuid id
      string source_type
      uuid source_id
      string target_type
      uuid target_id
      string relationship_type
      uuid project_id
    }
    EMBEDDING {
      uuid id
      uuid project_id
      string resource_type
      uuid resource_id
      vector embedding_vector
    }
```

## API Documentation

All endpoints except register/login require:

```http
Authorization: Bearer <jwt>
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### Projects

```http
GET    /api/projects
POST   /api/projects
GET    /api/projects/{id}
DELETE /api/projects/{id}
POST   /api/projects/{id}/sync
```

### Unity Resources

```http
GET /api/projects/{id}/scripts
GET /api/scripts/{scriptId}
GET /api/projects/{id}/scenes
GET /api/projects/{id}/prefabs
```

### Search

```http
GET /api/projects/{id}/search?q=PlayerController
```

Combines PostgreSQL full-text search with pgvector semantic search. If OpenAI is not configured, full-text search still returns results.

### Chat

```http
POST /api/projects/{id}/chat
GET  /api/projects/{id}/chat/sessions
GET  /api/chat/sessions/{id}
```

Chat request:

```json
{
  "sessionId": null,
  "message": "How does player movement work?"
}
```

## Sync Sequence

```mermaid
sequenceDiagram
    participant Plugin as Unity Plugin
    participant API as Spring Controller
    participant Service as ProjectSyncService
    participant DB as PostgreSQL + pgvector
    participant OpenAI as OpenAI API

    Plugin->>API: POST /api/projects/{id}/sync
    API->>Service: validate DTO
    Service->>DB: verify project ownership
    Service->>DB: upsert scripts/scenes/prefabs
    Service->>OpenAI: create embeddings per resource
    Service->>DB: store vectors in pgvector
    Service->>DB: replace dependency graph
    Service->>DB: update lastSyncAt
    API-->>Plugin: sync counts
```

## Chat Sequence

```mermaid
sequenceDiagram
    participant Web as Web App
    participant API as Spring Controller
    participant Chat as ChatService
    participant DB as PostgreSQL + pgvector
    participant OpenAI as OpenAI API

    Web->>API: POST /api/projects/{id}/chat
    API->>Chat: message + optional sessionId
    Chat->>DB: verify project ownership
    Chat->>OpenAI: embed user question
    Chat->>DB: nearest vectors by cosine distance
    Chat->>DB: load only relevant resources
    Chat->>OpenAI: prompt with retrieved context
    Chat->>DB: persist user + assistant messages
    API-->>Web: answer + source paths
```

## Notes

- The backend is intentionally monolithic: no queues, no microservices, no distributed orchestration.
- Ownership is validated through `ProjectService.getOwnedProject(...)` before project-scoped operations.
- Chat uses RAG and never sends the entire project to the model.
- `schema.sql` is the source for PostgreSQL + pgvector setup. In production, move it into Flyway or Liquibase migrations.
