const baseURL='http://localhost:8080';

const API_URLS={
    users:`${baseURL}/users`,
    tasks: `${baseURL}/tasks`,
    assignTask: (taskId) => `${baseURL}/tasks/${taskId}/assign`
};

export default API_URLS;
export {baseURL};