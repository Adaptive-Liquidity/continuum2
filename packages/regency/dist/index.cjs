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
  RegencyEngine: () => RegencyEngine
});
module.exports = __toCommonJS(index_exports);
var cedar = __toESM(require("@cedar-policy/cedar-wasm"), 1);
var RegencyEngine = class {
  async evaluatePolicy(policy, principal, action, resource, context = {}) {
    const response = cedar.isAuthorized({
      principal: `User::"${principal}"`,
      action: `Action::"${action}"`,
      resource: `Resource::"${resource}"`,
      context,
      entities: [],
      policies: policy
    });
    return response.decision === "Allow";
  }
  async revokeGrant(client, tenantId, authorityId) {
    await client.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    const res = await client.query(`
      UPDATE authority_grants
      SET
        status = 'REVOKED',
        revoked_at = NOW(),
        version = version + 1
      WHERE authority_id = $2 AND status = 'ACTIVE'
      RETURNING *
    `, [authorityId]);
    if (res.rowCount === 0) {
      throw new Error(`Authority Grant ${authorityId} not found or not active.`);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RegencyEngine
});
