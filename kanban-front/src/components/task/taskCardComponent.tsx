"use client";

import React from 'react';
import { Card, Tag, Avatar, Tooltip, Popconfirm } from 'antd';
import { 
    EditOutlined, 
    DeleteOutlined, 
    CalendarOutlined, 
    UserOutlined,
    FlagOutlined 
} from '@ant-design/icons';
import Task from '@/models/Task';
import User from '@/models/User';
import dayjs from 'dayjs';

interface TaskCardComponentProps {
    task: Task;
    users: User[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
    onDragStart: (e: React.DragEvent, task: Task) => void;
}

export default function TaskCardComponent({ 
    task, 
    users, 
    onEdit, 
    onDelete, 
    onDragStart 
}: TaskCardComponentProps) {
    const priorityColors = {
        low: '#52c41a',
        medium: '#faad14',
        high: '#f5222d'
    };

    const getUserById = (userId: string) => {
        return users.find(user => user.id === userId);
    };

    const isOverdue = (dueDate: string) => {
        if (!dueDate) return false;
        return dayjs(dueDate).isBefore(dayjs(), 'day');
    };

    return (
        <Card
            size="small"
            className="cursor-move hover:shadow-md transition-shadow"
            draggable
            onDragStart={(e) => onDragStart(e, task)}
            actions={[
                <EditOutlined 
                    key="edit" 
                    onClick={() => onEdit(task)} 
                />,
                <Popconfirm
                    key="delete"
                    title="Supprimer cette tâche ?"
                    description="Cette action est irréversible."
                    onConfirm={() => onDelete(task.id!)}
                    okText="Oui"
                    cancelText="Non"
                >
                    <DeleteOutlined />
                </Popconfirm>
            ]}
        >
            <div className="mb-2">
                <h3 className="font-medium text-gray-800 mb-1">
                    {task.title}
                </h3>
                {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {task.description}
                    </p>
                )}
            </div>
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Tag 
                        color={priorityColors[task.priority]}
                        icon={<FlagOutlined />}
                    >
                        {task.priority === 'low' ? 'Basse' : 
                         task.priority === 'medium' ? 'Moyenne' : 'Haute'}
                    </Tag>
                </div>
                
                <div className="flex items-center gap-2">
                    {task.assignedUsers && task.assignedUsers.length > 0 && (
                        <Avatar.Group maxCount={2} size="small">
                            {task.assignedUsers.map(userId => {
                                const user = getUserById(userId);
                                return (
                                    <Tooltip 
                                        key={userId}
                                        title={user ? `${user.firstname} ${user.lastname}` : 'Utilisateur inconnu'}
                                    >
                                        <Avatar 
                                            size="small"
                                            icon={<UserOutlined />}
                                            style={{ 
                                                backgroundColor: user ? '#1890ff' : '#ccc'
                                            }}
                                        >
                                            {user ? user.firstname?.[0]?.toUpperCase() : '?'}
                                        </Avatar>
                                    </Tooltip>
                                );
                            })}
                        </Avatar.Group>
                    )}
                    
                    {task.dueDate && (
                        <Tooltip title={`Échéance: ${dayjs(task.dueDate).format('DD/MM/YYYY')}`}>
                            <Tag 
                                color={isOverdue(task.dueDate) ? 'red' : 'blue'}
                                icon={<CalendarOutlined />}
                            >
                                {dayjs(task.dueDate).format('DD/MM')}
                            </Tag>
                        </Tooltip>
                    )}
                </div>
            </div>
        </Card>
    );
}
