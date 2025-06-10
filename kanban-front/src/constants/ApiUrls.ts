const baseURL = 'http://localhost:8080';

const API_URLS = {
    users: `${baseURL}/users`,
    tasks: `${baseURL}/tasks`,
    boards: `${baseURL}/boards`,
    assignTask: (taskId: string) => `${baseURL}/tasks/${taskId}/assign`,
    moveTask: (taskId: string) => `${baseURL}/tasks/${taskId}/move`,
    boardTasks: (boardId: string) => `${baseURL}/boards/${boardId}/tasks`,
};

export default API_URLS;
export { baseURL };
