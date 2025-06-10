import User from "./User";

export default class Task {
    id: string | null = null;
    title: string = '';
    description: string = '';
    priority: 'low' | 'medium' | 'high' = 'medium';
    status: string = 'TODO';
    dueDate: string | null = null;
    assignedUsers: User[] = [];
    createdAt: string | null = null;
    updatedAt: string | null = null;

    constructor(data?: Partial<Task>) {
        if (data) {
            Object.assign(this, data);
        }
    }
}
