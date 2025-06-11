import TaskComponent from "@/components/kanban/TaskComponent"; // ✅ Corrigé: utilise le bon chemin
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";

interface TaskPageProps {
    params: {
        taskId: string;
    };
}

const getTaskData = async (taskId: string) => {
    try {
        const taskResponse = await HttpService.get(`${API_URLS.tasks}/${taskId}`);
        const projectUsersResponse = await HttpService.get(API_URLS.users);
        return {
            task: taskResponse.data,
            projectUsers: projectUsersResponse.data
        };
    } catch (error) {
        return {
            task: null,
            projectUsers: []
        };
    }
};

export default async function TaskPage({ params }: TaskPageProps) {
    const { taskId } = params;
    const { task, projectUsers } = await getTaskData(taskId);

    if (!task) {
        return <div>Tâche non trouvée</div>;
    }

    return (
        <TaskComponent
            taskId={task.id}
            projectusers={projectUsers}
            assignedusers={task.assignedUsers || []}
        />
    );
}