import { PoolClient } from 'pg';

declare class EffectBoundary {
    private regency;
    commitTimeRecheckAndDispatch(client: PoolClient, tenantId: string, operation: any, activePolicy: string): Promise<string>;
}

export { EffectBoundary };
