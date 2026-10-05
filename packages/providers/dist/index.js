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
  GitHubProvider: () => GitHubProvider,
  RunloopContainment: () => RunloopContainment
});
module.exports = __toCommonJS(index_exports);
var GitHubProvider = class {
  supportsIdempotencyKeys = false;
  async prepare(op) {
    let naturalKey = void 0;
    if (op.action === "pull_request.create") {
      const params = JSON.parse(op.params_digest || "{}");
      naturalKey = params.head || `continuum/op_${op.operation_id}`;
    }
    return {
      effect: {
        action: op.action,
        resource: op.resource,
        params: op.params_digest
      },
      natural_key: naturalKey
    };
  }
  async execute(effect, cred) {
    return {
      v: 1,
      receipt_id: `rcp_sim${Date.now()}`,
      tenant_id: "ten_sim",
      operation_id: "op_sim",
      outcome: "COMMITTED",
      observed_via: "response",
      at: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async reconcile(op) {
    if (!op.natural_key) {
      return "UNDETERMINED";
    }
    if (op.natural_key.includes("continuum/op_")) {
      return "COMMITTED";
    }
    return "ABSENT";
  }
};
var RunloopContainment = class {
  static getAgentGatewayConfig() {
    return {
      network_policy: {
        allow_devbox_to_devbox: false,
        allowlist: [
          "registry.npmjs.org",
          "pypi.org"
        ],
        denylist: [
          "api.github.com"
          // Must go through EB
        ],
        default: "deny"
      },
      credential_broker: {
        enabled: true,
        inject_canaries: true
      }
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GitHubProvider,
  RunloopContainment
});
