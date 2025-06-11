"use client";

import User from "@/models/User";
import {Badge, Button, List, Modal, message} from "antd";
import {useState} from "react";
import UserFormComponent from "@/components/users/UserFormComponent";
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";

interface UsersComponentProps {
    users: User[];
}

export default function UsersComponent({users: initialUsers}: UsersComponentProps){
    // S'assurer que initialUsers est un array
    const [users, setUsers] = useState<User[]>(Array.isArray(initialUsers) ? initialUsers : []);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [editedUser, setEditedUser] = useState<User | null>(null);

    const addUser = async (user: User) => {
        try {
            // Supprimer l'id s'il est null/undefined
            const userToSend = { ...user };
            if (!userToSend.id) {
                delete userToSend.id;
            }

            const response = await HttpService.post(API_URLS.users, userToSend);
            if (response.status === 201 && response.data) {
                // Ajouter le nouvel utilisateur à la liste
                setUsers(prevUsers => [...prevUsers, response.data]);
                message.success('Utilisateur créé avec succès');
            } else {
                message.error('Erreur lors de la création de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
            message.error('Erreur lors de la création de l\'utilisateur');
        }
        setShowModal(false);
    };

    const updateUser = async (user: User) => {
        try {
            const response = await HttpService.put(`${API_URLS.users}/${user.id}`, user);
            if (response.status === 200 && response.data) {
                // Mettre à jour l'utilisateur dans la liste
                setUsers(prevUsers =>
                    prevUsers.map(u => u.id === user.id ? response.data : u)
                );
                message.success('Utilisateur modifié avec succès');
            } else {
                message.error('Erreur lors de la modification de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la modification:', error);
            message.error('Erreur lors de la modification de l\'utilisateur');
        }
        setShowModal(false);
    };

    const deleteUser = async (userId: string) => {
        try {
            const response = await HttpService.delete(`${API_URLS.users}/${userId}`);
            if (response.status === 204) {
                setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
                message.success('Utilisateur supprimé avec succès');
            } else {
                message.error('Erreur lors de la suppression de l\'utilisateur');
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            message.error('Erreur lors de la suppression de l\'utilisateur');
        }
    };

    const handleModalOk = () => {
        if (!editedUser) return;

        if (editedUser.id) {
            updateUser(editedUser);
        } else {
            addUser(editedUser);
        }
    };

    return (
        <>
            <Button
                type="primary"
                onClick={() => {
                    setEditedUser(new User());
                    setShowModal(true);
                }}
            >
                Ajouter un utilisateur
            </Button>

            <Modal
                open={showModal}
                title={editedUser?.id ? "Modifier un utilisateur" : "Ajouter un utilisateur"}
                onCancel={() => setShowModal(false)}
                onOk={handleModalOk}
                okText={editedUser?.id ? "Modifier" : "Ajouter"}
                cancelText="Annuler"
            >
                {editedUser && (
                    <UserFormComponent user={editedUser} setUser={setEditedUser}/>
                )}
            </Modal>

            <List
                dataSource={users}
                header={
                    <h2 className="text-xl font-bold">
                        Utilisateurs <Badge color="cyan" count={users.length}/>
                    </h2>
                }
                renderItem={(user: User) => (
                    <List.Item
                        key={user.id}
                        actions={[
                            <Button
                                key="edit"
                                type="default"
                                shape="circle"
                                icon={<i className="fas fa-edit"/>}
                                onClick={() => {
                                    setEditedUser(user);
                                    setShowModal(true);
                                }}
                            />,
                            <Button
                                key="delete"
                                danger
                                shape="circle"
                                icon={<i className="fas fa-trash"/>}
                                onClick={() => {
                                    if (user.id) {
                                        deleteUser(user.id);
                                    }
                                }}
                            />
                        ]}
                    >
                        <div className="flex items-center gap-4 w-full">
                            <div className="flex-1">
                                {user.firstname} {user.lastname} ({user.username}) - {user.email}
                            </div>
                        </div>
                    </List.Item>
                )}
            />
        </>
    );
}