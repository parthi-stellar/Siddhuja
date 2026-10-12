-- Review the current public.user_login definition before running this migration.
-- Safe to rerun for the project's existing (id, username, email) table.
CREATE TABLE IF NOT EXISTS public.user_login (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.user_login ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
ALTER TABLE public.user_login ADD COLUMN IF NOT EXISTS enabled BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE public.user_login ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE public.user_login ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Keep identity generation working if the table predates this migration.
CREATE SEQUENCE IF NOT EXISTS public.user_login_id_seq;
SELECT setval('public.user_login_id_seq', GREATEST(COALESCE((SELECT MAX(id) FROM public.user_login), 0) + 1, 1), FALSE);
ALTER TABLE public.user_login ALTER COLUMN id SET DEFAULT nextval('public.user_login_id_seq');
CREATE UNIQUE INDEX IF NOT EXISTS user_login_username_lower_uq ON public.user_login (LOWER(username));
