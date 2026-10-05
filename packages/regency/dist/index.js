// src/index.ts
import * as cedar from "@cedar-policy/cedar-wasm";
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
export {
  RegencyEngine
};
