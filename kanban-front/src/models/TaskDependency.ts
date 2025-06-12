export default class TaskDependency {
    id: string | null = null;
    sourceTaskId: string; // La tâche qui dépend
    targetTaskId: string; // La tâche dont on dépend
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();

    constructor(sourceTaskId: string, targetTaskId: string) {
        this.sourceTaskId = sourceTaskId;
        this.targetTaskId = targetTaskId;
    }
} 