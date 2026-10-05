import { PoolClient } from 'pg';
import { Principal } from '@continuum/contracts';
import { z } from 'zod';

declare class VeraEngine {
    rotateCredential(client: PoolClient, tenantId: string, principalId: string, newCredentialDigest: string): Promise<void>;
    suspendPrincipal(client: PoolClient, tenantId: string, principalId: string): Promise<void>;
    getPrincipal(client: PoolClient, tenantId: string, principalId: string): Promise<z.infer<typeof Principal>>;
}

export { VeraEngine };
