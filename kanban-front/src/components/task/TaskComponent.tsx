"use client";

import { useState } from "react";
import { Button, List } from "antd";
import TaskFormComponent from "@/components/task/TaskFormComponent";
import User from "@/models/User";

export default function TaskComponent({ taskId, projectusers = [], assignedusers = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedusers, setSelectedusers] = useState(new Set(assignedusers.map(user => user?.id)));
    const [projectusersList, setProjectusersList] = useState(projectusers);

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>Assigner des membres</Button>
            {isModalOpen && (
                <TaskFormComponent
                    taskId={taskId}
                    projectusers={projectusersList}
                    assignedusers={Array.from(selectedusers).map(id => projectusersList.find(m => m?.id === id))}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
            <div>
                <h3>Membres assignés:</h3>
                <List
                    dataSource={Array.from(selectedusers)
                        .map(id => projectusersList?.find(m => m?.id === id))
                        .filter(user => user)}
                    renderItem={(user) => (
                        <List.Item key={user?.id}>
                            {user?.firstname} {user?.lastname} ({user?.username})
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
}