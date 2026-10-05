declare class GitHubProvider {
    supportsIdempotencyKeys: boolean;
    prepare(op: any): Promise<{
        effect: unknown;
        natural_key?: string;
    }>;
    execute(effect: any, cred: {
        token: string;
        expires_at: string;
    }): Promise<any>;
    reconcile(op: any): Promise<"COMMITTED" | "ABSENT" | "UNDETERMINED">;
}
declare class RunloopContainment {
    static getAgentGatewayConfig(): {
        network_policy: {
            allow_devbox_to_devbox: boolean;
            allowlist: string[];
            denylist: string[];
            default: string;
        };
        credential_broker: {
            enabled: boolean;
            inject_canaries: boolean;
        };
    };
}

export { GitHubProvider, RunloopContainment };
