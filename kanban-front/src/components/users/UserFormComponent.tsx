import User from "@/models/User";
import {Form, Input} from "antd";

interface UserFormComponentProps {
    user: User;
    setUser: (u: User) => void;
}

export default function UserFormComponent({user, setUser}: UserFormComponentProps){
    return (
        <>
            <h2 className="text-lg font-bold">Utilisateur</h2>
            <Form layout="vertical">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="username">Nom d'utilisateur</label>
                        <Input
                            type="text"
                            id="username"
                            value={user.username || ''}
                            onChange={(e) => {
                                setUser({...user, username: e.target.value});
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <Input
                            type="email"
                            id="email"
                            value={user.email || ''}
                            onChange={(e) => {
                                setUser({...user, email: e.target.value});
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="firstname">Prénom</label>
                        <Input
                            type="text"
                            id="firstname"
                            value={user.firstname || ''}
                            onChange={(e) => {
                                setUser({...user, firstname: e.target.value});
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="lastname">Nom</label>
                        <Input
                            type="text"
                            id="lastname"
                            value={user.lastname || ''}
                            onChange={(e) => {
                                setUser({...user, lastname: e.target.value});
                            }}
                        />
                    </div>
                </div>
            </Form>
        </>
    );
}