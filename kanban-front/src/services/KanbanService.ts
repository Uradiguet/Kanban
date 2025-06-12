import HttpService from './HttpService';
import API_URLS from '@/constants/ApiUrls';
import Task from '@/models/Task';
import Board from '@/models/Board';
import TaskDependency from '@/models/TaskDependency';

export default class KanbanService {
    // Board operations
    static async getBoards() {
        return HttpService.get<Board[]>(API_URLS.boards);
    }

    static async createBoard(board: Partial<Board>) {
        return HttpService.post<Board>(API_URLS.boards, board);
    }

    static async updateBoard(boardId: string, board: Partial<Board>) {
        return HttpService.put<Board>(`${API_URLS.boards}/${boardId}`, board);
    }

    static async deleteBoard(boardId: string) {
        return HttpService.delete(`${API_URLS.boards}/${boardId}`);
    }

    // Task operations
    static async getTasks() {
        return HttpService.get<Task[]>(API_URLS.tasks);
    }

    static async createTask(task: Partial<Task>) {
        return HttpService.post<Task>(API_URLS.tasks, task);
    }

    static async updateTask(taskId: string, task: Partial<Task>) {
        return HttpService.put<Task>(`${API_URLS.tasks}/${taskId}`, task);
    }

    static async deleteTask(taskId: string) {
        return HttpService.delete(`${API_URLS.tasks}/${taskId}`);
    }

    static async moveTask(taskId: string, fromBoardId: string, toBoardId: string) {
        try {
            const response = await fetch(API_URLS.moveTask(taskId), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fromBoardId,
                    toBoardId
                })
            });

            const data = await response.text();
            
            if (!response.ok) {
                console.error('Erreur lors du déplacement de la tâche:', data);
                throw new Error(data);
            }

            return { status: response.status, data: JSON.parse(data) };
        } catch (error: any) {
            console.error('Erreur lors du déplacement de la tâche:', error);
            if (error.message) {
                throw new Error(error.message);
            }
            throw error;
        }
    }

    static async assignUsersToTask(taskId: string, userIds: string[]) {
        return HttpService.put(`${API_URLS.tasks}/${taskId}/assign`, {
            users: userIds
        });
    }

    static async updateTaskDependencies(taskId: string, dependencies: TaskDependency[]) {
        return HttpService.put(`${API_URLS.tasks}/${taskId}/dependencies`, {
            dependencies: dependencies.map(dep => ({
                sourceTaskId: dep.sourceTaskId,
                targetTaskId: dep.targetTaskId
            }))
        });
    }

    static async updateTaskStatus(taskId: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') {
        return HttpService.put(`${API_URLS.tasks}/${taskId}/status`, {
            status
        });
    }

    static async addTaskDependency(sourceTaskId: string, targetTaskId: string) {
        return HttpService.post(API_URLS.taskDependencies(sourceTaskId), {
            targetTaskId
        });
    }

    static async removeTaskDependency(sourceTaskId: string, targetTaskId: string) {
        return HttpService.delete(`${API_URLS.taskDependencies(sourceTaskId)}/${targetTaskId}`);
    }

    static async getTaskDependencies(taskId: string) {
        return HttpService.get<Task[]>(API_URLS.taskDependencies(taskId));
    }

    static async validateTaskDependencies(taskId: string): Promise<boolean> {
        try {
            const response = await HttpService.get(`${API_URLS.validateDependencies(taskId)}`);
            return response.status === 200 && response.data.valid;
        } catch (error) {
            console.error('Erreur lors de la validation des dépendances:', error);
            return false;
        }
    }

    static async addDependency(sourceTaskId: string, targetTaskId: string) {
        return HttpService.post(`${API_URLS.dependency(sourceTaskId, targetTaskId)}`);
    }

    static async removeDependency(sourceTaskId: string, targetTaskId: string) {
        return HttpService.delete(`${API_URLS.dependency(sourceTaskId, targetTaskId)}`);
    }

    static async getDependentTasks(taskId: string) {
        return HttpService.get<Task[]>(`${API_URLS.tasks}/${taskId}/dependent-tasks`);
    }

    // Board tasks
    static async getBoardTasks(boardId: string) {
        return HttpService.get<Task[]>(API_URLS.boardTasks(boardId));
    }
}
