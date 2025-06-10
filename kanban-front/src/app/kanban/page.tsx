import KanbanComponent from "@/components/kanban/KanbanComponent";
import KanbanService from "@/services/KanbanService";
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";

const getKanbanData = async () => {
    try {
        const [boardsResponse, tasksResponse, usersResponse] = await Promise.all([
            KanbanService.getBoards(),
            KanbanService.getTasks(),
            HttpService.get(API_URLS.users)
        ]);

        return {
            boards: boardsResponse.status === 200 ? boardsResponse.data : [],
            tasks: tasksResponse.status === 200 ? tasksResponse.data : [],
            users: usersResponse.status === 200 ? usersResponse.data : []
        };
    } catch (error) {
        console.error('Erreur lors du chargement des données Kanban:', error);
        return {
            boards: [],
            tasks: [],
            users: []
        };
    }
};

export default async function KanbanPage() {
    const { boards, tasks, users } = await getKanbanData();
    
    return (
        <KanbanComponent 
            initialBoards={boards} 
            initialTasks={tasks} 
            users={users} 
        />
    );
}
