"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthorityGrant: () => AuthorityGrant,
  Checkpoint: () => Checkpoint,
  EvidenceCheckpoint: () => EvidenceCheckpoint,
  EvidenceEvent: () => EvidenceEvent,
  Operation: () => Operation,
  OperationState: () => OperationState,
  Principal: () => Principal,
  Receipt: () => Receipt,
  Ts: () => Ts
});
module.exports = __toCommonJS(index_exports);
var import_zod = require("zod");
var Id = (p) => import_zod.z.string().regex(new RegExp(`^${p}_[0-9A-HJKMNP-TV-Z]{26}$`));
var Ts = import_zod.z.string().datetime();
var Principal = import_zod.z.object({
  v: import_zod.z.literal(1),
  principal_id: Id("prn"),
  tenant_id: Id("ten"),
  display_name: import_zod.z.string(),
  owner_user_id: import_zod.z.string(),
  // WorkOS user (accountable human)
  status: import_zod.z.enum(["ACTIVE", "SUSPENDED", "RETIRED"]),
  epoch: import_zod.z.number().int().nonnegative(),
  // bump on suspend/rotate -> fences old creds/ops
  credential_ids: import_zod.z.array(import_zod.z.string()),
  // rotating; identity != credential
  created_at: Ts
});
var AuthorityGrant = import_zod.z.object({
  v: import_zod.z.literal(1),
  authority_id: Id("grt"),
  tenant_id: Id("ten"),
  principal_id: Id("prn"),
  staxion_id: Id("stx").optional(),
  provider: import_zod.z.string(),
  // "github"
  actions: import_zod.z.array(import_zod.z.string()),
  // ["issues.read","branch.create","pull_request.create"]
  resource: import_zod.z.string(),
  // "github:repo/acme/widgets"
  constraints: import_zod.z.record(import_zod.z.unknown()),
  // e.g. { branch_prefix: "continuum/", max_ops_per_hour: 20 }
  requires_approval: import_zod.z.boolean().default(false),
  policy_version: import_zod.z.string(),
  // Cedar policy-set hash
  status: import_zod.z.enum(["ACTIVE", "REVOKED", "EXPIRED"]),
  version: import_zod.z.number().int(),
  // bumped on any change -> commit-time fence
  issued_at: Ts,
  expires_at: Ts,
  revoked_at: Ts.optional()
});
var OperationState = import_zod.z.enum([
  "REQUESTED",
  "PLANNED",
  "AWAITING_APPROVAL",
  "AUTHORIZED",
  "DENIED",
  "DISPATCHED",
  "EXECUTING",
  "COMMITTED",
  "FAILED",
  "UNCERTAIN",
  "RECONCILING",
  "COMPENSATED",
  "EXPIRED",
  "CANCELLED"
]);
var Operation = import_zod.z.object({
  v: import_zod.z.literal(1),
  operation_id: Id("op"),
  tenant_id: Id("ten"),
  staxion_id: Id("stx"),
  principal_id: Id("prn"),
  principal_epoch: import_zod.z.number().int(),
  task_id: Id("tsk"),
  execution_id: Id("exe").optional(),
  provider: import_zod.z.string(),
  action: import_zod.z.string(),
  resource: import_zod.z.string(),
  params_digest: import_zod.z.string(),
  // sha256 of canonical params (params stored separately)
  idempotency_key: import_zod.z.string(),
  // unique per (tenant, provider)
  natural_key: import_zod.z.string().optional(),
  // e.g. branch "continuum/op_..." for non-idempotent providers
  authority: import_zod.z.object({ authority_id: Id("grt"), grant_version: import_zod.z.number().int(), decision_id: import_zod.z.string() }).optional(),
  state: OperationState,
  deadline: Ts,
  attempt: import_zod.z.number().int(),
  consequential: import_zod.z.boolean(),
  // crosses VM boundary / provider effect
  created_at: Ts,
  updated_at: Ts
});
var Receipt = import_zod.z.object({
  // written by EB only
  v: import_zod.z.literal(1),
  receipt_id: Id("rcp"),
  tenant_id: Id("ten"),
  operation_id: Id("op"),
  outcome: import_zod.z.enum(["COMMITTED", "FAILED", "UNCERTAIN"]),
  provider_request_id: import_zod.z.string().optional(),
  provider_object_ref: import_zod.z.string().optional(),
  // e.g. PR URL
  observed_via: import_zod.z.enum(["response", "reconcile_readback"]),
  at: Ts
});
var Checkpoint = import_zod.z.object({
  v: import_zod.z.literal(1),
  checkpoint_id: Id("chk"),
  tenant_id: Id("ten"),
  staxion_id: Id("stx"),
  kind: import_zod.z.enum(["COORDINATOR", "COMPUTER"]),
  // DB workflow state vs Runloop snapshot / workspace tarball
  task_id: Id("tsk").optional(),
  object_ref: import_zod.z.string().optional(),
  at: Ts
});
var EvidenceEvent = import_zod.z.object({
  // append-only; UNIQUE(tenant_id, seq)
  v: import_zod.z.literal(1),
  event_id: Id("evt"),
  tenant_id: Id("ten"),
  seq: import_zod.z.number().int(),
  kind: import_zod.z.enum(["DECISION", "EFFECT", "RECEIPT", "APPROVAL", "REVOCATION", "RECOVERY", "ALERT", "EGRESS_DENIED"]),
  subject: import_zod.z.object({ principal_id: Id("prn").optional(), operation_id: Id("op").optional(), authority_id: Id("grt").optional() }),
  body_digest: import_zod.z.string(),
  prev_hash: import_zod.z.string(),
  hash: import_zod.z.string(),
  // hash = sha256(prev_hash || canonical(event))
  at: Ts
});
var EvidenceCheckpoint = import_zod.z.object({
  // signed (KMS Ed25519), externally anchored
  tenant_id: Id("ten"),
  upto_seq: import_zod.z.number().int(),
  head_hash: import_zod.z.string(),
  signature: import_zod.z.string(),
  key_id: import_zod.z.string(),
  anchor: import_zod.z.object({ type: import_zod.z.enum(["rfc3161", "rekor", "object_lock"]), ref: import_zod.z.string() }).optional()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthorityGrant,
  Checkpoint,
  EvidenceCheckpoint,
  EvidenceEvent,
  Operation,
  OperationState,
  Principal,
  Receipt,
  Ts
});
