import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";
import UsersComponent from "@/components/users/UsersComponent";

const getUsers = async () => {
    try {
        const response = await HttpService.get(API_URLS.users);
        // Retourner les données ou un array vide si erreur
        return response.status === 200 ? response.data : [];
    } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return [];
    }
};

export default async function UserPage(){
    const users = await getUsers();
    return (
        <UsersComponent users={users} />
    );
}