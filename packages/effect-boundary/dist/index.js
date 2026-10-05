"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  EffectBoundary: () => EffectBoundary
});
module.exports = __toCommonJS(index_exports);
var import_regency = require("@continuum/regency");
var crypto = __toESM(require("crypto"));
var EffectBoundary = class {
  regency = new import_regency.RegencyEngine();
  async commitTimeRecheckAndDispatch(client, tenantId, operation, activePolicy) {
    await client.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    const grantRes = await client.query(`
      SELECT * FROM authority_grants
      WHERE authority_id = $1
      FOR SHARE
    `, [operation.authority?.authority_id]);
    if (grantRes.rowCount === 0) {
      throw new Error(`Authority Grant ${operation.authority?.authority_id} not found.`);
    }
    const grant = grantRes.rows[0];
    if (grant.status !== "ACTIVE") {
      throw new Error(`Authority Grant ${grant.authority_id} is not ACTIVE.`);
    }
    if (grant.version !== operation.authority?.grant_version) {
      throw new Error(`Authority Grant version mismatch. Expected ${operation.authority?.grant_version}, got ${grant.version}.`);
    }
    const principalRes = await client.query(`
      SELECT epoch FROM principals WHERE principal_id = $1
    `, [operation.principal_id]);
    if (principalRes.rowCount === 0 || principalRes.rows[0].epoch !== operation.principal_epoch) {
      throw new Error(`Principal epoch mismatch or principal not found.`);
    }
    const isAuthorized = await this.regency.evaluatePolicy(
      activePolicy,
      operation.principal_id,
      operation.action,
      operation.resource,
      { ...grant.constraints, approved: operation.state === "AWAITING_APPROVAL" ? true : false }
      // Context mapping
    );
    if (!isAuthorized) {
      throw new Error("Cedar policy denied the operation at commit time.");
    }
    await client.query(`
      UPDATE operations
      SET state = 'DISPATCHED', updated_at = NOW()
      WHERE operation_id = $1
    `, [operation.operation_id]);
    await client.query(`
      INSERT INTO transactional_outbox (tenant_id, topic, payload)
      VALUES ($1, $2, $3)
    `, [tenantId, "operation.dispatched", JSON.stringify(operation)]);
    const prevHashRes = await client.query(`
      SELECT hash FROM evidence_events WHERE tenant_id = $1 ORDER BY seq DESC LIMIT 1
    `, [tenantId]);
    const prevHash = prevHashRes.rowCount != null && prevHashRes.rowCount > 0 ? prevHashRes.rows[0].hash : "genesis";
    const seqRes = await client.query(`SELECT COALESCE(MAX(seq), 0) + 1 as next_seq FROM evidence_events WHERE tenant_id = $1`, [tenantId]);
    const seq = seqRes.rows[0].next_seq;
    const evidencePayload = {
      tenant_id: tenantId,
      operation_id: operation.operation_id,
      decision: "DISPATCHED",
      grant_version: grant.version,
      principal_epoch: operation.principal_epoch
    };
    const bodyDigest = crypto.createHash("sha256").update(JSON.stringify(evidencePayload)).digest("hex");
    const hash = crypto.createHash("sha256").update(prevHash + bodyDigest).digest("hex");
    await client.query(`
      INSERT INTO evidence_events (event_id, tenant_id, seq, kind, subject_operation_id, body_digest, prev_hash, hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [`evt_${crypto.randomBytes(13).toString("hex")}`, tenantId, seq, "DECISION", operation.operation_id, bodyDigest, prevHash, hash]);
    const shortLivedToken = crypto.randomBytes(32).toString("hex");
    return shortLivedToken;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EffectBoundary
});
