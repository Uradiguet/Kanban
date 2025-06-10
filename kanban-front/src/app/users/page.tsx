import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";
import UsersComponent from "@/components/users/UsersComponent";

const getUsers = async () => {
    return HttpService.get(API_URLS.users);
};

export default async function UserPage(){
    const users = await getUsers();
    return (
        <>
        <UsersComponent users={users} />
        </>
    );
}