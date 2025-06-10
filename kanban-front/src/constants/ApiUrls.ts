const baseURL = 'http://localhost:8080';

const API_URLS = {
    // Users - OK, pas de changement
    users: `${baseURL}/users`,
    
    // Tasks - Endpoints complets
    tasks: `${baseURL}/tasks`,
    moveTask: (taskId: string) => `${baseURL}/tasks/${taskId}/move`,
    assignTask: (taskId: string) => `${baseURL}/tasks/${taskId}/assign`,
    
    // Boards - NOUVEAUX endpoints
    boards: `${baseURL}/boards`,
    boardTasks: (boardId: string) => `${baseURL}/boards/${boardId}/tasks`,
    
    // Projects - OK, existants
    projects: `${baseURL}/projects`,
    projectMembers: (projectId: string) => `${baseURL}/projects/${projectId}/members`,
};

export default API_URLS;
export { baseURL };
