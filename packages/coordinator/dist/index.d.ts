import { PoolClient } from 'pg';

type TransactionContext<T> = {
    client: T;
};
type WorkflowContext = {
    invoke: (target: any) => any;
};
declare class CoordinatorEngine {
    private effectBoundary;
    static startOperation(ctx: TransactionContext<PoolClient>, tenantId: string, operation: any): Promise<void>;
    static executeOperationWorkflow(ctx: WorkflowContext, tenantId: string, operation: any, activePolicy: string): Promise<any>;
    static commitDispatch(ctx: TransactionContext<PoolClient>, tenantId: string, operation: any, activePolicy: string): Promise<string>;
}

export { CoordinatorEngine, type TransactionContext, type WorkflowContext };
