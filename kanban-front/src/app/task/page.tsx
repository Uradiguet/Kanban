import TaskComponent from "@/components/task/TaskComponent";
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";

const getTaskData = async (taskId) => {
    const taskResponse = await HttpService.get(`${API_URLS.tasks}/${taskId}`);
    const projectUsersResponse = await HttpService.get(API_URLS.users);
    return {
        task: taskResponse.data,
        projectUsers: projectUsersResponse.data
    };
};

export default async function TaskPage({ taskId }) {
    const { task, projectUsers } = await getTaskData(taskId);
    return (
        <TaskComponent taskId={task.id} projectusers={projectUsers} assignedusers={task.assignedUsers} />
    );
}