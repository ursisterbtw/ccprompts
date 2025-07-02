-- Create PostgreSQL extensions for enhanced functionality
-- Extensions for development, analytics, and performance

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable advanced text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enable JSON/JSONB operations
CREATE EXTENSION IF NOT EXISTS "btree_gin";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Enable cryptographic functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable advanced statistics
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Enable connection pooling stats
CREATE EXTENSION IF NOT EXISTS "pg_buffercache";

-- Enable table and index statistics
CREATE EXTENSION IF NOT EXISTS "pageinspect";

-- Enable foreign data wrappers (useful for integrations)
CREATE EXTENSION IF NOT EXISTS "postgres_fdw";

-- Enable advanced indexing
CREATE EXTENSION IF NOT EXISTS "bloom";

-- Print status
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL extensions installed successfully for CCPrompts development';
END $$;