-- Create utility functions for CCPrompts development
-- Performance monitoring, audit triggers, and development helpers

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to create audit trail for any table
CREATE OR REPLACE FUNCTION create_audit_trigger()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit.activity_log (action, table_name, record_id, old_values, timestamp)
        VALUES ('DELETE', TG_TABLE_NAME, OLD.id::text, row_to_json(OLD), NOW());
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit.activity_log (action, table_name, record_id, old_values, new_values, timestamp)
        VALUES ('UPDATE', TG_TABLE_NAME, NEW.id::text, row_to_json(OLD), row_to_json(NEW), NOW());
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit.activity_log (action, table_name, record_id, new_values, timestamp)
        VALUES ('INSERT', TG_TABLE_NAME, NEW.id::text, row_to_json(NEW), NOW());
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to get database statistics
CREATE OR REPLACE FUNCTION get_database_stats()
RETURNS TABLE (
    stat_name TEXT,
    stat_value BIGINT,
    description TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'total_tables'::TEXT,
        COUNT(*)::BIGINT,
        'Total number of tables in all schemas'::TEXT
    FROM information_schema.tables 
    WHERE table_schema NOT IN ('information_schema', 'pg_catalog')
    
    UNION ALL
    
    SELECT 
        'total_connections'::TEXT,
        COUNT(*)::BIGINT,
        'Current active connections'::TEXT
    FROM pg_stat_activity
    
    UNION ALL
    
    SELECT 
        'database_size_mb'::TEXT,
        (pg_database_size(current_database()) / 1024 / 1024)::BIGINT,
        'Database size in megabytes'::TEXT
    
    UNION ALL
    
    SELECT 
        'cache_hit_ratio'::TEXT,
        ROUND((sum(blks_hit) * 100.0 / sum(blks_hit + blks_read)))::BIGINT,
        'Cache hit ratio percentage'::TEXT
    FROM pg_stat_database;
END;
$$ LANGUAGE plpgsql;

-- Function to clean old audit logs
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs(days_to_keep INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM audit.activity_log 
    WHERE timestamp < NOW() - INTERVAL '1 day' * days_to_keep;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    INSERT INTO audit.activity_log (action, table_name, new_values, timestamp)
    VALUES ('CLEANUP', 'audit.activity_log', 
            json_build_object('deleted_records', deleted_count, 'days_kept', days_to_keep),
            NOW());
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to analyze table performance
CREATE OR REPLACE FUNCTION analyze_table_performance(schema_name TEXT DEFAULT 'ccprompts')
RETURNS TABLE (
    table_name TEXT,
    total_size TEXT,
    table_size TEXT,
    index_size TEXT,
    row_estimate BIGINT,
    seq_scan BIGINT,
    idx_scan BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.table_name::TEXT,
        pg_size_pretty(pg_total_relation_size(c.oid))::TEXT as total_size,
        pg_size_pretty(pg_relation_size(c.oid))::TEXT as table_size,
        pg_size_pretty(pg_total_relation_size(c.oid) - pg_relation_size(c.oid))::TEXT as index_size,
        s.n_tup_ins + s.n_tup_upd + s.n_tup_del as row_estimate,
        s.seq_scan,
        s.idx_scan
    FROM information_schema.tables t
    JOIN pg_class c ON c.relname = t.table_name
    LEFT JOIN pg_stat_user_tables s ON s.relname = t.table_name
    WHERE t.table_schema = schema_name
    AND t.table_type = 'BASE TABLE'
    ORDER BY pg_total_relation_size(c.oid) DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get configuration value with default
CREATE OR REPLACE FUNCTION get_config_value(config_key TEXT, default_value TEXT DEFAULT NULL)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    SELECT value::TEXT INTO result 
    FROM config.settings 
    WHERE key = config_key;
    
    IF result IS NULL THEN
        RETURN default_value;
    END IF;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to set configuration value
CREATE OR REPLACE FUNCTION set_config_value(config_key TEXT, config_value JSONB, config_description TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    INSERT INTO config.settings (key, value, description, updated_at)
    VALUES (config_key, config_value, config_description, NOW())
    ON CONFLICT (key) 
    DO UPDATE SET 
        value = EXCLUDED.value,
        description = COALESCE(EXCLUDED.description, config.settings.description),
        updated_at = NOW();
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to log analytics event
CREATE OR REPLACE FUNCTION log_analytics_event(
    event_type TEXT,
    event_data JSONB,
    user_id TEXT DEFAULT NULL,
    session_id TEXT DEFAULT NULL,
    metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    event_id := gen_random_uuid();
    
    INSERT INTO analytics.events (id, event_type, event_data, user_id, session_id, metadata, timestamp)
    VALUES (event_id, event_type, event_data, user_id, session_id, metadata, NOW());
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(days_back INTEGER DEFAULT 7)
RETURNS TABLE (
    event_type TEXT,
    event_count BIGINT,
    unique_users BIGINT,
    first_seen TIMESTAMP WITH TIME ZONE,
    last_seen TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.event_type::TEXT,
        COUNT(*)::BIGINT as event_count,
        COUNT(DISTINCT e.user_id)::BIGINT as unique_users,
        MIN(e.timestamp) as first_seen,
        MAX(e.timestamp) as last_seen
    FROM analytics.events e
    WHERE e.timestamp >= NOW() - INTERVAL '1 day' * days_back
    GROUP BY e.event_type
    ORDER BY event_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy database monitoring
CREATE OR REPLACE VIEW monitoring.database_health AS
SELECT 
    'Database Size' as metric,
    pg_size_pretty(pg_database_size(current_database())) as value,
    'Total size of current database' as description
UNION ALL
SELECT 
    'Active Connections',
    count(*)::text,
    'Number of active database connections'
FROM pg_stat_activity
WHERE state = 'active'
UNION ALL
SELECT 
    'Cache Hit Ratio',
    ROUND((sum(blks_hit) * 100.0 / sum(blks_hit + blks_read)), 2)::text || '%',
    'Percentage of queries served from cache'
FROM pg_stat_database
WHERE datname = current_database();

-- Grant execute permissions to developer
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO developer;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA ccprompts TO developer;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA analytics TO developer;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA audit TO developer;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA config TO developer;

-- Print status
DO $$
BEGIN
    RAISE NOTICE 'Database functions and views created successfully for CCPrompts development';
    RAISE NOTICE 'Available functions:';
    RAISE NOTICE '- get_database_stats(): Get overall database statistics';
    RAISE NOTICE '- analyze_table_performance(): Analyze table performance metrics';
    RAISE NOTICE '- get_config_value(key, default): Get configuration values';
    RAISE NOTICE '- set_config_value(key, value, description): Set configuration values';
    RAISE NOTICE '- log_analytics_event(): Log analytics events';
    RAISE NOTICE '- get_analytics_summary(days): Get analytics summary';
    RAISE NOTICE '- cleanup_old_audit_logs(days): Clean old audit records';
END $$;