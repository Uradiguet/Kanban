import Task from './Task';

export default class Board {
    id: string | null = null;
    title: string = '';
    color: string = 'bg-gray-100 border-gray-300';
    tasks: Task[] = [];
    position: number = 0;
    createdAt: string = new Date().toISOString();
    updatedAt: string = new Date().toISOString();
}
