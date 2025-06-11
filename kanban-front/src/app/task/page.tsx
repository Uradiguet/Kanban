import TaskComponent from "@/components/kanban/TaskComponent";
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";

interface TaskPageProps {
    params: {
        taskId: string;
    };
}

const getTaskData = async (taskId: string) => {
    try {
        const [taskResponse, projectUsersResponse] = await Promise.all([
            HttpService.get(`${API_URLS.tasks}/${taskId}`),
            HttpService.get(API_URLS.users)
        ]);

        return {
            task: (taskResponse.status === 200 && taskResponse.data) ? taskResponse.data : null,
            projectUsers: (projectUsersResponse.status === 200 && projectUsersResponse.data) ? projectUsersResponse.data : []
        };
    } catch (error) {
        console.error('Erreur lors du chargement de la tâche:', error);
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
        return (
            <div className="p-6">
                <h1 className="text-xl font-bold">Tâche non trouvée</h1>
                <p>La tâche avec l'ID {taskId} n'existe pas ou n'a pas pu être chargée.</p>
            </div>
        );
    }

    return (
        <TaskComponent
            taskId={task.id}
            projectusers={projectUsers}
            assignedusers={task.assignedUsers || []}
        />
    );
}