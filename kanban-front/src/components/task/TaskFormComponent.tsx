"use client";

import { useState } from "react";
import { Button, Modal, List, Checkbox } from "antd";
import HttpService from "@/services/HttpService";
import API_URLS from "@/constants/ApiUrls";
import User from "@/models/User";

export default function TaskFormComponent({ taskId, projectusers = [], assignedusers = [], onClose }) {
    const [selectedusers, setSelectedusers] = useState(new Set(assignedusers.map(user => user?.id)));

    const toggleuserSelection = (userId) => {
        setSelectedusers((prevSelected) => {
            const newSelected = new Set(prevSelected);
            if (newSelected.has(userId)) {
                newSelected.delete(userId);
            } else {
                newSelected.add(userId);
            }
            return newSelected;
        });
    };

    const handleAssign = () => {
        const updatedusers = Array.from(selectedusers);
        HttpService.put(`${API_URLS.tasks}/${taskId}/assign`, { users: updatedusers }).then((response) => {
            if (response.status === 200) {
                onClose();
            }
        });
    };

    return (
        <Modal
            title="Assigner des membres à la tâche"
            open={true}
            onCancel={onClose}
            onOk={handleAssign}
        >
            <List
                dataSource={projectusers}
                renderItem={(user) => (
                    <List.Item>
                        <Checkbox
                            checked={selectedusers.has(user?.id)}
                            onChange={() => toggleuserSelection(user?.id)}
                        >
                            {user?.firstname} {user?.lastname} ({user?.username})
                        </Checkbox>
                    </List.Item>
                )}
            />
        </Modal>
    );
}