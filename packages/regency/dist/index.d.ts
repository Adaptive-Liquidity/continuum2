import { PoolClient } from 'pg';

declare class RegencyEngine {
    evaluatePolicy(policy: string, principal: string, action: string, resource: string, context?: Record<string, any>): Promise<boolean>;
    revokeGrant(client: PoolClient, tenantId: string, authorityId: string): Promise<void>;
}

export { RegencyEngine };
