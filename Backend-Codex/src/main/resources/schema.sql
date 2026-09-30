create extension if not exists vector;

create table if not exists users (
    id uuid primary key,
    name varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null,
    created_at timestamptz not null,
    updated_at timestamptz not null
);

create table if not exists projects (
    id uuid primary key,
    name varchar(255) not null,
    unity_version varchar(255) not null,
    files_uploaded int not null default 0,
    files_indexed int not null default 0,
    last_uploaded_at timestamptz,
    last_sync_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    user_id uuid not null references users(id) on delete cascade
);

alter table projects add column if not exists files_uploaded int not null default 0;
alter table projects add column if not exists files_indexed int not null default 0;
alter table projects add column if not exists last_uploaded_at timestamptz;
alter table projects add column if not exists last_sync_at timestamptz;

create table if not exists project_files (
    id uuid primary key,
    name varchar(255) not null,
    type varchar(40) not null,
    path varchar(255) not null,
    size bigint not null,
    content text,
    project_id uuid not null references projects(id) on delete cascade,
    uploaded_at timestamptz not null,
    indexed_at timestamptz,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    unique (project_id, path)
);

create index if not exists idx_project_files_project_id on project_files(project_id);
create index if not exists idx_project_files_path_project on project_files(project_id, path);

create table if not exists scripts (
    id uuid primary key,
    name varchar(255) not null,
    path varchar(255) not null,
    content text not null,
    project_id uuid not null references projects(id) on delete cascade,
    created_at timestamptz not null,
    updated_at timestamptz not null,
    unique (project_id, path)
);

create table if not exists scenes (
    id uuid primary key,
    name varchar(255) not null,
    path varchar(255) not null,
    project_id uuid not null references projects(id) on delete cascade,
    unique (project_id, path)
);

create table if not exists prefabs (
    id uuid primary key,
    name varchar(255) not null,
    path varchar(255) not null,
    project_id uuid not null references projects(id) on delete cascade,
    unique (project_id, path)
);

create table if not exists dependencies (
    id uuid primary key,
    source_type varchar(40) not null,
    source_id uuid not null,
    target_type varchar(40) not null,
    target_id uuid not null,
    relationship_type varchar(40) not null,
    project_id uuid not null references projects(id) on delete cascade
);

create table if not exists embeddings (
    id uuid primary key,
    project_id uuid not null references projects(id) on delete cascade,
    resource_type varchar(40) not null,
    resource_id uuid not null,
    embedding_vector vector(1536) not null,
    created_at timestamptz not null,
    unique (project_id, resource_type, resource_id)
);

create table if not exists chat_sessions (
    id uuid primary key,
    project_id uuid not null references projects(id) on delete cascade,
    title varchar(255) not null,
    created_at timestamptz not null
);

create table if not exists chat_messages (
    id uuid primary key,
    session_id uuid not null references chat_sessions(id) on delete cascade,
    role varchar(40) not null,
    content text not null,
    created_at timestamptz not null
);

create index if not exists idx_users_email on users(email);
create index if not exists idx_projects_user_id on projects(user_id);
create index if not exists idx_scripts_project_id on scripts(project_id);
create index if not exists idx_scenes_project_id on scenes(project_id);
create index if not exists idx_prefabs_project_id on prefabs(project_id);
create index if not exists idx_dependencies_project_id on dependencies(project_id);
create index if not exists idx_embeddings_project_id on embeddings(project_id);
create index if not exists idx_embeddings_resource on embeddings(resource_type, resource_id);
create index if not exists idx_chat_sessions_project_id on chat_sessions(project_id);
create index if not exists idx_chat_messages_session_id on chat_messages(session_id);

create index if not exists idx_scripts_fts
    on scripts using gin (to_tsvector('english', name || ' ' || path || ' ' || content));
create index if not exists idx_scenes_fts
    on scenes using gin (to_tsvector('english', name || ' ' || path));
create index if not exists idx_prefabs_fts
    on prefabs using gin (to_tsvector('english', name || ' ' || path));
create index if not exists idx_embeddings_vector
    on embeddings using ivfflat (embedding_vector vector_cosine_ops) with (lists = 100);
