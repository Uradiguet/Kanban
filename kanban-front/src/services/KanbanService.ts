import HttpService from './HttpService';
import API_URLS from '@/constants/ApiUrls';
import Task from '@/models/Task';
import Board from '@/models/Board';

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
        return HttpService.put(`${API_URLS.tasks}/${taskId}/move`, {
            fromBoardId,
            toBoardId
        });
    }

    static async assignUsersToTask(taskId: string, userIds: string[]) {
        return HttpService.put(`${API_URLS.tasks}/${taskId}/assign`, {
            users: userIds
        });
    }

    // Board tasks
    static async getBoardTasks(boardId: string) {
        return HttpService.get<Task[]>(API_URLS.boardTasks(boardId));
    }
}
