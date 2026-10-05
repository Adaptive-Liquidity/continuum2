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
  CoordinatorEngine: () => CoordinatorEngine
});
module.exports = __toCommonJS(index_exports);
var import_effect_boundary = require("@continuum/effect-boundary");
var CoordinatorEngine = class _CoordinatorEngine {
  effectBoundary = new import_effect_boundary.EffectBoundary();
  static async startOperation(ctx, tenantId, operation) {
    await ctx.client.query(`SET LOCAL app.current_tenant = $1`, [tenantId]);
    await ctx.client.query(`
      INSERT INTO operations (
        operation_id, tenant_id, staxion_id, principal_id, principal_epoch, task_id, provider, action, resource, params_digest, idempotency_key, state, deadline, consequential
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
    `, [
      operation.operation_id,
      tenantId,
      operation.staxion_id,
      operation.principal_id,
      operation.principal_epoch,
      operation.task_id,
      operation.provider,
      operation.action,
      operation.resource,
      operation.params_digest,
      operation.idempotency_key,
      operation.state,
      operation.deadline,
      operation.consequential
    ]);
  }
  static async executeOperationWorkflow(ctx, tenantId, operation, activePolicy) {
    const providerToken = await ctx.invoke(_CoordinatorEngine).commitDispatch(tenantId, operation, activePolicy);
    return providerToken;
  }
  static async commitDispatch(ctx, tenantId, operation, activePolicy) {
    const effectBoundary = new import_effect_boundary.EffectBoundary();
    return await effectBoundary.commitTimeRecheckAndDispatch(ctx.client, tenantId, operation, activePolicy);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CoordinatorEngine
});
