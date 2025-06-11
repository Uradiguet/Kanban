"use client";

import { useState } from "react";
import { Button, Card, Tag, Avatar, Tooltip } from "antd";
import { CalendarOutlined, UserOutlined, FlagOutlined } from "@ant-design/icons";
import TaskFormComponent from "./TaskFormComponent";
import User from "@/models/User";
import dayjs from "dayjs";

interface TaskComponentProps {
    taskId: string;
    projectusers?: User[];
    assignedusers?: User[];
}

export default function TaskComponent({
                                          taskId,
                                          projectusers = [],
                                          assignedusers = []
                                      }: TaskComponentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState(new Set(assignedusers.map(user => user?.id)));

    const priorityColors = {
        low: '#52c41a',
        medium: '#faad14',
        high: '#f5222d'
    };

    const handleFormSubmit = (values: any) => {
        console.log('Form submitted:', values);
        setIsModalOpen(false);
        // Ici vous pouvez ajouter la logique pour sauvegarder
    };

    return (
        <div className="p-6">
            <Card
                title={`Détails de la tâche ${taskId}`}
                extra={
                    <Button
                        type="primary"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Modifier
                    </Button>
                }
            >
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold mb-2">Utilisateurs assignés :</h3>
                        <div className="flex gap-2 flex-wrap">
                            {assignedusers.map(user => (
                                <Tooltip
                                    key={user?.id}
                                    title={`${user?.firstname} ${user?.lastname}`}
                                >
                                    <Avatar icon={<UserOutlined />}>
                                        {user?.firstname?.[0]}
                                    </Avatar>
                                </Tooltip>
                            ))}
                            {assignedusers.length === 0 && (
                                <span className="text-gray-500">Aucun utilisateur assigné</span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h2 className="text-xl font-bold mb-4">Modifier la tâche</h2>
                        <TaskFormComponent
                            task={undefined}
                            users={projectusers}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}