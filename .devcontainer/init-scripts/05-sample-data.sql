-- Insert sample data for CCPrompts development
-- Test data for development and testing purposes

-- Sample configuration data
INSERT INTO config.settings (key, value, description) VALUES
    ('max_prompt_length', '10000', 'Maximum allowed prompt length'),
    ('default_language', '"en"', 'Default language for prompts'),
    ('cache_ttl_seconds', '3600', 'Cache time-to-live in seconds'),
    ('rate_limit_per_minute', '100', 'API rate limit per minute'),
    ('enable_telemetry', 'true', 'Enable telemetry collection'),
    ('log_level', '"debug"', 'Application log level'),
    ('feature_flags', '{"advanced_search": true, "beta_features": false}', 'Feature flags configuration'),
    ('theme_settings', '{"dark_mode": true, "accent_color": "#007acc"}', 'UI theme settings')
ON CONFLICT (key) DO NOTHING;

-- Sample analytics events
INSERT INTO analytics.events (event_type, event_data, user_id, session_id, metadata) VALUES
    ('user_login', '{"method": "oauth", "provider": "github"}', 'user_001', 'session_001', '{"ip": "127.0.0.1"}'),
    ('prompt_created', '{"category": "development", "length": 1500}', 'user_001', 'session_001', '{"source": "web"}'),
    ('prompt_executed', '{"prompt_id": "prompt_001", "execution_time_ms": 250}', 'user_001', 'session_001', '{"success": true}'),
    ('search_performed', '{"query": "docker setup", "results_count": 15}', 'user_002', 'session_002', '{"source": "api"}'),
    ('command_used', '{"command": "/bootstrap-project", "args": "web-app typescript"}', 'user_002', 'session_002', '{"success": true}'),
    ('error_occurred', '{"error_type": "validation", "message": "Invalid prompt format"}', 'user_003', 'session_003', '{"severity": "warning"}'),
    ('feature_used', '{"feature": "dagger_pipeline", "action": "full_run"}', 'user_001', 'session_004', '{"duration_ms": 5000}'),
    ('dashboard_viewed', '{"dashboard": "development_overview", "widgets_loaded": 8}', 'user_002', 'session_005', '{"load_time_ms": 800}')
ON CONFLICT DO NOTHING;

-- Sample audit log entries
INSERT INTO audit.activity_log (action, table_name, record_id, new_values, user_id, ip_address) VALUES
    ('INSERT', 'prompts', '001', '{"title": "Test Prompt", "category": "development"}', 'user_001', '127.0.0.1'),
    ('UPDATE', 'prompts', '001', '{"title": "Updated Test Prompt", "category": "development"}', 'user_001', '127.0.0.1'),
    ('INSERT', 'config', '002', '{"key": "test_setting", "value": "test_value"}', 'admin', '127.0.0.1'),
    ('DELETE', 'temp_data', '003', '{"temporary": true}', 'user_002', '127.0.0.1')
ON CONFLICT DO NOTHING;

-- Create sample development tables for testing
CREATE TABLE IF NOT EXISTS ccprompts.prompts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    tags TEXT[],
    created_by VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS ccprompts.commands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    configuration JSONB
);

CREATE TABLE IF NOT EXISTS ccprompts.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    preferences JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Add updated_at triggers to sample tables
CREATE TRIGGER update_prompts_updated_at 
    BEFORE UPDATE ON ccprompts.prompts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commands_updated_at 
    BEFORE UPDATE ON ccprompts.commands 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON ccprompts.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add audit triggers to sample tables
CREATE TRIGGER audit_prompts 
    AFTER INSERT OR UPDATE OR DELETE ON ccprompts.prompts 
    FOR EACH ROW EXECUTE FUNCTION create_audit_trigger();

CREATE TRIGGER audit_commands 
    AFTER INSERT OR UPDATE OR DELETE ON ccprompts.commands 
    FOR EACH ROW EXECUTE FUNCTION create_audit_trigger();

-- Insert sample prompts data
INSERT INTO ccprompts.prompts (title, content, category, tags, created_by, metadata) VALUES
    ('Docker Setup Guide', 'Complete guide for setting up Docker in development environment', 'infrastructure', 
     ARRAY['docker', 'containerization', 'development'], 'developer', 
     '{"difficulty": "beginner", "estimated_time": "30 minutes"}'),
    
    ('Security Audit Checklist', 'Comprehensive security audit procedures for applications', 'security', 
     ARRAY['security', 'audit', 'compliance'], 'security_team', 
     '{"difficulty": "advanced", "estimated_time": "2 hours"}'),
    
    ('API Testing Framework', 'Framework for comprehensive API testing and validation', 'testing', 
     ARRAY['api', 'testing', 'automation'], 'qa_team', 
     '{"difficulty": "intermediate", "estimated_time": "45 minutes"}'),
    
    ('Performance Optimization', 'Guidelines for optimizing application performance', 'performance', 
     ARRAY['optimization', 'performance', 'monitoring'], 'developer', 
     '{"difficulty": "advanced", "estimated_time": "1 hour"}'),
    
    ('Git Workflow Best Practices', 'Best practices for Git workflows in team environments', 'development', 
     ARRAY['git', 'workflow', 'collaboration'], 'team_lead', 
     '{"difficulty": "intermediate", "estimated_time": "20 minutes"}')
ON CONFLICT DO NOTHING;

-- Insert sample commands data
INSERT INTO ccprompts.commands (name, description, usage_count, configuration) VALUES
    ('bootstrap-project', 'Initialize a new project with modern tooling', 15, 
     '{"default_template": "web-app", "supported_languages": ["typescript", "python", "go"]}'),
    
    ('audit-security', 'Perform comprehensive security analysis', 8, 
     '{"scan_types": ["static", "dynamic", "dependency"], "severity_threshold": "medium"}'),
    
    ('refactor', 'Intelligent code refactoring and modernization', 12, 
     '{"backup_enabled": true, "auto_test": true, "safety_checks": true}'),
    
    ('test', 'Generate and run comprehensive test suites', 25, 
     '{"test_types": ["unit", "integration", "e2e"], "coverage_threshold": 80}'),
    
    ('deploy', 'Automated deployment with rollback capabilities', 6, 
     '{"environments": ["staging", "production"], "rollback_enabled": true}')
ON CONFLICT (name) DO NOTHING;

-- Insert sample users data
INSERT INTO ccprompts.users (username, email, full_name, preferences) VALUES
    ('dev_user', 'dev@ccprompts.com', 'Development User', 
     '{"theme": "dark", "notifications": true, "preferred_language": "typescript"}'),
    
    ('security_admin', 'security@ccprompts.com', 'Security Administrator', 
     '{"theme": "light", "notifications": true, "security_alerts": true}'),
    
    ('qa_tester', 'qa@ccprompts.com', 'QA Tester', 
     '{"theme": "dark", "notifications": false, "auto_run_tests": true}')
ON CONFLICT (username) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompts_category ON ccprompts.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_tags ON ccprompts.prompts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON ccprompts.prompts(created_at);
CREATE INDEX IF NOT EXISTS idx_prompts_active ON ccprompts.prompts(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_commands_usage_count ON ccprompts.commands(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_commands_last_used ON ccprompts.commands(last_used);

CREATE INDEX IF NOT EXISTS idx_users_active ON ccprompts.users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_last_login ON ccprompts.users(last_login);

-- Create a view for popular prompts
CREATE OR REPLACE VIEW ccprompts.popular_prompts AS
SELECT 
    p.id,
    p.title,
    p.category,
    p.tags,
    p.created_by,
    p.created_at,
    COALESCE(ae.usage_count, 0) as usage_count
FROM ccprompts.prompts p
LEFT JOIN (
    SELECT 
        (event_data->>'prompt_id')::integer as prompt_id,
        COUNT(*) as usage_count
    FROM analytics.events 
    WHERE event_type = 'prompt_executed'
    GROUP BY prompt_id
) ae ON p.id = ae.prompt_id
WHERE p.is_active = true
ORDER BY usage_count DESC, p.created_at DESC;

-- Create a view for command analytics
CREATE OR REPLACE VIEW ccprompts.command_analytics AS
SELECT 
    c.name,
    c.description,
    c.usage_count as db_usage_count,
    COALESCE(ae.recent_usage, 0) as recent_usage_7days,
    c.last_used,
    c.created_at
FROM ccprompts.commands c
LEFT JOIN (
    SELECT 
        event_data->>'command' as command_name,
        COUNT(*) as recent_usage
    FROM analytics.events 
    WHERE event_type = 'command_used'
    AND timestamp >= NOW() - INTERVAL '7 days'
    GROUP BY command_name
) ae ON c.name = ae.command_name
ORDER BY recent_usage_7days DESC, c.usage_count DESC;

-- Grant permissions on new objects
GRANT ALL ON ALL TABLES IN SCHEMA ccprompts TO developer;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ccprompts TO developer;
GRANT SELECT ON ALL TABLES IN SCHEMA ccprompts TO developer;

-- Print completion status
DO $$
BEGIN
    RAISE NOTICE 'Sample data and development tables created successfully!';
    RAISE NOTICE 'Created tables: prompts, commands, users';
    RAISE NOTICE 'Created views: popular_prompts, command_analytics';
    RAISE NOTICE 'Inserted sample data for development and testing';
    RAISE NOTICE 'Database is ready for CCPrompts development!';
END $$;