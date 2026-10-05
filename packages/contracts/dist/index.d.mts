import { z } from 'zod';

declare const Ts: z.ZodString;
declare const Principal: z.ZodObject<{
    v: z.ZodLiteral<1>;
    principal_id: z.ZodString;
    tenant_id: z.ZodString;
    display_name: z.ZodString;
    owner_user_id: z.ZodString;
    status: z.ZodEnum<["ACTIVE", "SUSPENDED", "RETIRED"]>;
    epoch: z.ZodNumber;
    credential_ids: z.ZodArray<z.ZodString, "many">;
    created_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    v: 1;
    status: "ACTIVE" | "SUSPENDED" | "RETIRED";
    principal_id: string;
    tenant_id: string;
    display_name: string;
    owner_user_id: string;
    epoch: number;
    credential_ids: string[];
    created_at: string;
}, {
    v: 1;
    status: "ACTIVE" | "SUSPENDED" | "RETIRED";
    principal_id: string;
    tenant_id: string;
    display_name: string;
    owner_user_id: string;
    epoch: number;
    credential_ids: string[];
    created_at: string;
}>;
declare const AuthorityGrant: z.ZodObject<{
    v: z.ZodLiteral<1>;
    authority_id: z.ZodString;
    tenant_id: z.ZodString;
    principal_id: z.ZodString;
    staxion_id: z.ZodOptional<z.ZodString>;
    provider: z.ZodString;
    actions: z.ZodArray<z.ZodString, "many">;
    resource: z.ZodString;
    constraints: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    requires_approval: z.ZodDefault<z.ZodBoolean>;
    policy_version: z.ZodString;
    status: z.ZodEnum<["ACTIVE", "REVOKED", "EXPIRED"]>;
    version: z.ZodNumber;
    issued_at: z.ZodString;
    expires_at: z.ZodString;
    revoked_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    v: 1;
    status: "ACTIVE" | "REVOKED" | "EXPIRED";
    principal_id: string;
    tenant_id: string;
    authority_id: string;
    provider: string;
    actions: string[];
    resource: string;
    constraints: Record<string, unknown>;
    requires_approval: boolean;
    policy_version: string;
    version: number;
    issued_at: string;
    expires_at: string;
    staxion_id?: string | undefined;
    revoked_at?: string | undefined;
}, {
    v: 1;
    status: "ACTIVE" | "REVOKED" | "EXPIRED";
    principal_id: string;
    tenant_id: string;
    authority_id: string;
    provider: string;
    actions: string[];
    resource: string;
    constraints: Record<string, unknown>;
    policy_version: string;
    version: number;
    issued_at: string;
    expires_at: string;
    staxion_id?: string | undefined;
    requires_approval?: boolean | undefined;
    revoked_at?: string | undefined;
}>;
declare const OperationState: z.ZodEnum<["REQUESTED", "PLANNED", "AWAITING_APPROVAL", "AUTHORIZED", "DENIED", "DISPATCHED", "EXECUTING", "COMMITTED", "FAILED", "UNCERTAIN", "RECONCILING", "COMPENSATED", "EXPIRED", "CANCELLED"]>;
declare const Operation: z.ZodObject<{
    v: z.ZodLiteral<1>;
    operation_id: z.ZodString;
    tenant_id: z.ZodString;
    staxion_id: z.ZodString;
    principal_id: z.ZodString;
    principal_epoch: z.ZodNumber;
    task_id: z.ZodString;
    execution_id: z.ZodOptional<z.ZodString>;
    provider: z.ZodString;
    action: z.ZodString;
    resource: z.ZodString;
    params_digest: z.ZodString;
    idempotency_key: z.ZodString;
    natural_key: z.ZodOptional<z.ZodString>;
    authority: z.ZodOptional<z.ZodObject<{
        authority_id: z.ZodString;
        grant_version: z.ZodNumber;
        decision_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        authority_id: string;
        grant_version: number;
        decision_id: string;
    }, {
        authority_id: string;
        grant_version: number;
        decision_id: string;
    }>>;
    state: z.ZodEnum<["REQUESTED", "PLANNED", "AWAITING_APPROVAL", "AUTHORIZED", "DENIED", "DISPATCHED", "EXECUTING", "COMMITTED", "FAILED", "UNCERTAIN", "RECONCILING", "COMPENSATED", "EXPIRED", "CANCELLED"]>;
    deadline: z.ZodString;
    attempt: z.ZodNumber;
    consequential: z.ZodBoolean;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    v: 1;
    principal_id: string;
    tenant_id: string;
    created_at: string;
    staxion_id: string;
    provider: string;
    resource: string;
    operation_id: string;
    principal_epoch: number;
    task_id: string;
    action: string;
    params_digest: string;
    idempotency_key: string;
    state: "EXPIRED" | "REQUESTED" | "PLANNED" | "AWAITING_APPROVAL" | "AUTHORIZED" | "DENIED" | "DISPATCHED" | "EXECUTING" | "COMMITTED" | "FAILED" | "UNCERTAIN" | "RECONCILING" | "COMPENSATED" | "CANCELLED";
    deadline: string;
    attempt: number;
    consequential: boolean;
    updated_at: string;
    execution_id?: string | undefined;
    natural_key?: string | undefined;
    authority?: {
        authority_id: string;
        grant_version: number;
        decision_id: string;
    } | undefined;
}, {
    v: 1;
    principal_id: string;
    tenant_id: string;
    created_at: string;
    staxion_id: string;
    provider: string;
    resource: string;
    operation_id: string;
    principal_epoch: number;
    task_id: string;
    action: string;
    params_digest: string;
    idempotency_key: string;
    state: "EXPIRED" | "REQUESTED" | "PLANNED" | "AWAITING_APPROVAL" | "AUTHORIZED" | "DENIED" | "DISPATCHED" | "EXECUTING" | "COMMITTED" | "FAILED" | "UNCERTAIN" | "RECONCILING" | "COMPENSATED" | "CANCELLED";
    deadline: string;
    attempt: number;
    consequential: boolean;
    updated_at: string;
    execution_id?: string | undefined;
    natural_key?: string | undefined;
    authority?: {
        authority_id: string;
        grant_version: number;
        decision_id: string;
    } | undefined;
}>;
declare const Receipt: z.ZodObject<{
    v: z.ZodLiteral<1>;
    receipt_id: z.ZodString;
    tenant_id: z.ZodString;
    operation_id: z.ZodString;
    outcome: z.ZodEnum<["COMMITTED", "FAILED", "UNCERTAIN"]>;
    provider_request_id: z.ZodOptional<z.ZodString>;
    provider_object_ref: z.ZodOptional<z.ZodString>;
    observed_via: z.ZodEnum<["response", "reconcile_readback"]>;
    at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    v: 1;
    at: string;
    tenant_id: string;
    operation_id: string;
    receipt_id: string;
    outcome: "COMMITTED" | "FAILED" | "UNCERTAIN";
    observed_via: "response" | "reconcile_readback";
    provider_request_id?: string | undefined;
    provider_object_ref?: string | undefined;
}, {
    v: 1;
    at: string;
    tenant_id: string;
    operation_id: string;
    receipt_id: string;
    outcome: "COMMITTED" | "FAILED" | "UNCERTAIN";
    observed_via: "response" | "reconcile_readback";
    provider_request_id?: string | undefined;
    provider_object_ref?: string | undefined;
}>;
declare const Checkpoint: z.ZodObject<{
    v: z.ZodLiteral<1>;
    checkpoint_id: z.ZodString;
    tenant_id: z.ZodString;
    staxion_id: z.ZodString;
    kind: z.ZodEnum<["COORDINATOR", "COMPUTER"]>;
    task_id: z.ZodOptional<z.ZodString>;
    object_ref: z.ZodOptional<z.ZodString>;
    at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    v: 1;
    at: string;
    tenant_id: string;
    staxion_id: string;
    checkpoint_id: string;
    kind: "COORDINATOR" | "COMPUTER";
    task_id?: string | undefined;
    object_ref?: string | undefined;
}, {
    v: 1;
    at: string;
    tenant_id: string;
    staxion_id: string;
    checkpoint_id: string;
    kind: "COORDINATOR" | "COMPUTER";
    task_id?: string | undefined;
    object_ref?: string | undefined;
}>;
declare const EvidenceEvent: z.ZodObject<{
    v: z.ZodLiteral<1>;
    event_id: z.ZodString;
    tenant_id: z.ZodString;
    seq: z.ZodNumber;
    kind: z.ZodEnum<["DECISION", "EFFECT", "RECEIPT", "APPROVAL", "REVOCATION", "RECOVERY", "ALERT", "EGRESS_DENIED"]>;
    subject: z.ZodObject<{
        principal_id: z.ZodOptional<z.ZodString>;
        operation_id: z.ZodOptional<z.ZodString>;
        authority_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        principal_id?: string | undefined;
        authority_id?: string | undefined;
        operation_id?: string | undefined;
    }, {
        principal_id?: string | undefined;
        authority_id?: string | undefined;
        operation_id?: string | undefined;
    }>;
    body_digest: z.ZodString;
    prev_hash: z.ZodString;
    hash: z.ZodString;
    at: z.ZodString;
}, "strip", z.ZodTypeAny, {
    v: 1;
    at: string;
    tenant_id: string;
    kind: "DECISION" | "EFFECT" | "RECEIPT" | "APPROVAL" | "REVOCATION" | "RECOVERY" | "ALERT" | "EGRESS_DENIED";
    event_id: string;
    seq: number;
    subject: {
        principal_id?: string | undefined;
        authority_id?: string | undefined;
        operation_id?: string | undefined;
    };
    body_digest: string;
    prev_hash: string;
    hash: string;
}, {
    v: 1;
    at: string;
    tenant_id: string;
    kind: "DECISION" | "EFFECT" | "RECEIPT" | "APPROVAL" | "REVOCATION" | "RECOVERY" | "ALERT" | "EGRESS_DENIED";
    event_id: string;
    seq: number;
    subject: {
        principal_id?: string | undefined;
        authority_id?: string | undefined;
        operation_id?: string | undefined;
    };
    body_digest: string;
    prev_hash: string;
    hash: string;
}>;
declare const EvidenceCheckpoint: z.ZodObject<{
    tenant_id: z.ZodString;
    upto_seq: z.ZodNumber;
    head_hash: z.ZodString;
    signature: z.ZodString;
    key_id: z.ZodString;
    anchor: z.ZodOptional<z.ZodObject<{
        type: z.ZodEnum<["rfc3161", "rekor", "object_lock"]>;
        ref: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "rfc3161" | "rekor" | "object_lock";
        ref: string;
    }, {
        type: "rfc3161" | "rekor" | "object_lock";
        ref: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    tenant_id: string;
    upto_seq: number;
    head_hash: string;
    signature: string;
    key_id: string;
    anchor?: {
        type: "rfc3161" | "rekor" | "object_lock";
        ref: string;
    } | undefined;
}, {
    tenant_id: string;
    upto_seq: number;
    head_hash: string;
    signature: string;
    key_id: string;
    anchor?: {
        type: "rfc3161" | "rekor" | "object_lock";
        ref: string;
    } | undefined;
}>;
interface Provider {
    prepare(op: z.infer<typeof Operation>): Promise<{
        effect: unknown;
        natural_key?: string;
    }>;
    execute(effect: unknown, cred: {
        token: string;
        expires_at: string;
    }): Promise<z.infer<typeof Receipt>>;
    reconcile(op: z.infer<typeof Operation>): Promise<"COMMITTED" | "ABSENT" | "UNDETERMINED">;
    supportsIdempotencyKeys: boolean;
}

export { AuthorityGrant, Checkpoint, EvidenceCheckpoint, EvidenceEvent, Operation, OperationState, Principal, type Provider, Receipt, Ts };
