declare class ContinuumMCP {
    handleToolCall(toolName: string, params: any, authContext: {
        tenantId: string;
        principalId: string;
        activePolicy: string;
    }): Promise<{
        status: string;
        operation_id: string;
    } | undefined>;
}

export { ContinuumMCP };
