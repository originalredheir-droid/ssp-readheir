-- PostgreSQL Row-Level Security policies for tenant isolation.
-- Run these statements after migrations and after the "app.current_org" session variable is configured.

ALTER TABLE apps_core_tournament ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_tournament ON apps_core_tournament
    USING (organization_id = current_setting('app.current_org', true)::uuid);

ALTER TABLE apps_core_match ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_match ON apps_core_match
    USING (organization_id = current_setting('app.current_org', true)::uuid);

ALTER TABLE apps_core_player ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_player ON apps_core_player
    USING (organization_id = current_setting('app.current_org', true)::uuid);

-- If you want read-only cross-tenant admin access, add an additional policy that allows a special value.
-- Example: SET app.current_org = '00000000-0000-0000-0000-000000000000';
-- Then add a policy such as:
-- USING (org_id = current_setting('app.current_org', true)::uuid OR current_setting('app.current_org', true) = '00000000-0000-0000-0000-000000000000')
