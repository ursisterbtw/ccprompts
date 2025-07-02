-- Create database schemas for CCPrompts development
-- Organized schema structure for different application components

-- Main application schema
CREATE SCHEMA IF NOT EXISTS ccprompts;

-- Analytics and metrics schema
CREATE SCHEMA IF NOT EXISTS analytics;

-- Audit and logging schema
CREATE SCHEMA IF NOT EXISTS audit;

-- Configuration and settings schema
CREATE SCHEMA IF NOT EXISTS config;

-- Testing schema (for development/testing data)
CREATE SCHEMA IF NOT EXISTS testing;

-- Temporary schema for development experiments
CREATE SCHEMA IF NOT EXISTS temp_dev;

-- Grant permissions to developer user
GRANT USAGE ON SCHEMA ccprompts TO developer;
GRANT CREATE ON SCHEMA ccprompts TO developer;
GRANT USAGE ON SCHEMA analytics TO developer;
GRANT CREATE ON SCHEMA analytics TO developer;
GRANT USAGE ON SCHEMA audit TO developer;
GRANT CREATE ON SCHEMA audit TO developer;
GRANT USAGE ON SCHEMA config TO developer;
GRANT CREATE ON SCHEMA config TO developer;
GRANT USAGE ON SCHEMA testing TO developer;
GRANT CREATE ON SCHEMA testing TO developer;
GRANT USAGE ON SCHEMA temp_dev TO developer;
GRANT CREATE ON SCHEMA temp_dev TO developer;

-- Set default search path for developer
ALTER USER developer SET search_path = ccprompts, analytics, audit, config, public;

-- Create basic audit table structure
CREATE TABLE IF NOT EXISTS audit.activity_log (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);

-- Create configuration table
CREATE TABLE IF NOT EXISTS config.settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics.events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_activity_log_timestamp ON audit.activity_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON audit.activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_action ON audit.activity_log(action);

CREATE INDEX IF NOT EXISTS idx_events_timestamp ON analytics.events(timestamp);
CREATE INDEX IF NOT EXISTS idx_events_type ON analytics.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON analytics.events(user_id);

-- Insert initial configuration
INSERT INTO config.settings (key, value, description) VALUES
    ('app_name', '"CCPrompts Development"', 'Application name'),
    ('environment', '"development"', 'Current environment'),
    ('debug_mode', 'true', 'Enable debug logging'),
    ('analytics_enabled', 'true', 'Enable analytics collection'),
    ('audit_enabled', 'true', 'Enable audit logging')
ON CONFLICT (key) DO NOTHING;

-- Print status
DO $$
BEGIN
    RAISE NOTICE 'Database schemas and initial tables created successfully for CCPrompts';
END $$;