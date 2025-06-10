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
}
