const baseURL = 'http://localhost:8080';

const API_URLS = {
    users: `${baseURL}/users`,
    tasks: `${baseURL}/tasks`,
    boards: `${baseURL}/boards`,
    assignTask: (taskId: string) => `${baseURL}/tasks/${taskId}/assign`,
    moveTask: (taskId: string) => `${baseURL}/tasks/${taskId}/move`,
    boardTasks: (boardId: string) => `${baseURL}/boards/${boardId}/tasks`,
    taskDependencies: (taskId: string) => `${baseURL}/tasks/${taskId}/dependencies`,
    taskStatus: (taskId: string) => `${baseURL}/tasks/${taskId}/status`,
    validateDependencies: (taskId: string) => `${baseURL}/tasks/${taskId}/validate-dependencies`,
    dependency: (sourceTaskId: string, targetTaskId: string) => 
        `${baseURL}/tasks/${sourceTaskId}/dependencies/${targetTaskId}`,
};

export default API_URLS;
export { baseURL };
