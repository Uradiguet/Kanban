import TaskDependency from './TaskDependency';

export default class Task {
    id: string | null = null;
    title: string = '';
    description: string = '';
    priority: 'low' | 'medium' | 'high' = 'medium';
    assignee: string = '';
    dueDate: string = '';
    boardId: string | null = null;
    assignedUsers: string[] = [];
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
    status: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO';
    dependencies: TaskDependency[] = [];

    getDependencyTaskIds(): string[] {
        return this.dependencies.map(dep => dep.targetTaskId);
    }

    dependsOn(taskId: string): boolean {
        return this.dependencies.some(dep => dep.targetTaskId === taskId);
    }
}
