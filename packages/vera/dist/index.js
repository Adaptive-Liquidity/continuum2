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
  VeraEngine: () => VeraEngine
});
module.exports = __toCommonJS(index_exports);
var VeraEngine = class {
  async rotateCredential(client, tenantId, principalId, newCredentialDigest) {
    await client.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    const res = await client.query(`
      UPDATE principals
      SET
        credential_ids = array_append(credential_ids, $1),
        epoch = epoch + 1
      WHERE principal_id = $2 AND status = 'ACTIVE'
      RETURNING *
    `, [newCredentialDigest, principalId]);
    if (res.rowCount === 0) {
      throw new Error(`Principal ${principalId} not found or not active.`);
    }
  }
  async suspendPrincipal(client, tenantId, principalId) {
    await client.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    const res = await client.query(`
      UPDATE principals
      SET
        status = 'SUSPENDED',
        epoch = epoch + 1
      WHERE principal_id = $2
      RETURNING *
    `, [principalId]);
    if (res.rowCount === 0) {
      throw new Error(`Principal ${principalId} not found.`);
    }
  }
  async getPrincipal(client, tenantId, principalId) {
    await client.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    const res = await client.query(`
      SELECT * FROM principals WHERE principal_id = $1
    `, [principalId]);
    if (res.rowCount === 0) {
      throw new Error(`Principal ${principalId} not found.`);
    }
    const row = res.rows[0];
    return {
      v: 1,
      principal_id: row.principal_id,
      tenant_id: row.tenant_id,
      display_name: row.display_name,
      owner_user_id: row.owner_user_id,
      status: row.status,
      epoch: row.epoch,
      credential_ids: row.credential_ids,
      created_at: row.created_at.toISOString()
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  VeraEngine
});
