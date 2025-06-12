"use client";

import React, { useState, useEffect } from 'react';
import { Card, Tag, Avatar, Tooltip, Popconfirm, Badge } from 'antd';
import { 
    EditOutlined, 
    DeleteOutlined, 
    CalendarOutlined, 
    UserOutlined,
    FlagOutlined,
    LinkOutlined,
    LockOutlined,
    CheckCircleOutlined
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
    allTasks: Task[]; // Pour afficher les noms des tâches dépendantes
}

export default function TaskCardComponent({ 
    task, 
    users, 
    onEdit, 
    onDelete, 
    onDragStart,
    allTasks
}: TaskCardComponentProps) {
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockingTasks, setBlockingTasks] = useState<Task[]>([]);

    useEffect(() => {
        const incompleteDependencies = task.dependencies.filter(dep => {
            const dependencyTask = allTasks.find(t => t.id === dep.targetTaskId);
            return dependencyTask && dependencyTask.status !== 'DONE';
        });
        setIsBlocked(incompleteDependencies.length > 0);
        setBlockingTasks(incompleteDependencies.map(dep => 
            allTasks.find(t => t.id === dep.targetTaskId)!
        ));
    }, [task.dependencies, allTasks]);

    const handleDragStart = (e: React.DragEvent) => {
        if (isBlocked) {
            e.preventDefault();
            return;
        }
        onDragStart(e, task);
    };

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

    const getDependencyTaskNames = () => {
        return task.dependencies.map(dep => {
            const dependentTask = allTasks.find(t => t.id === dep.targetTaskId);
            return dependentTask ? dependentTask.title : 'Tâche inconnue';
        });
    };

    return (
        <Badge.Ribbon 
            text="Bloquée" 
            color="red"
            style={{ display: isBlocked ? 'block' : 'none' }}
        >
            <Card
                size="small"
                className={`cursor-move hover:shadow-md transition-shadow ${isBlocked ? 'opacity-75' : ''}`}
                draggable
                onDragStart={handleDragStart}
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
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800 mb-1">
                            {task.title}
                        </h3>
                        {isBlocked && (
                            <Tooltip title={`Bloquée par : ${blockingTasks.map(t => t.title).join(', ')}`}>
                                <LockOutlined className="text-red-500" />
                            </Tooltip>
                        )}
                    </div>
                    
                    {isBlocked && (
                        <div
                            style={{
                                background: task.status === 'TODO' ? '#ffeaea' : '#eaffea',
                                color: task.status === 'TODO' ? '#d32f2f' : '#388e3c',
                                borderRadius: 6,
                                padding: '4px 8px',
                                marginBottom: 4,
                                fontSize: 13,
                                fontWeight: 500,
                                border: `1px solid ${task.status === 'TODO' ? '#ffcdd2' : '#c8e6c9'}`
                            }}
                        >
                            Bloqué par : {blockingTasks.map(t => t.title).join(', ')}
                        </div>
                    )}

                    {task.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {task.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        {task.priority && (
                            <Tag 
                                color={
                                    task.priority === 'high' ? 'red' :
                                    task.priority === 'medium' ? 'orange' : 'blue'
                                }
                                icon={<FlagOutlined />}
                            >
                                {task.priority === 'low' ? 'Basse' : 
                                 task.priority === 'medium' ? 'Moyenne' : 'Haute'}
                            </Tag>
                        )}
                        
                        <Tag color={task.status === 'DONE' ? 'green' : 
                                  task.status === 'IN_PROGRESS' ? 'blue' : 'default'}>
                            {task.status === 'DONE' ? 'Terminé' :
                             task.status === 'IN_PROGRESS' ? 'En cours' : 'À faire'}
                        </Tag>

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

                        {task.dependencies.length > 0 && (
                            <Tooltip title={`Dépend de : ${task.dependencies.map(dep => {
                                const dependencyTask = allTasks.find(t => t.id === dep.targetTaskId);
                                return dependencyTask ? dependencyTask.title : 'Tâche inconnue';
                            }).join(', ')}`}>
                                <Tag icon={<LinkOutlined />} color="purple">
                                    {task.dependencies.length} dépendance(s)
                                </Tag>
                            </Tooltip>
                        )}
                    </div>

                    {task.assignedUsers && task.assignedUsers.length > 0 && (
                        <div className="flex items-center gap-2">
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
                        </div>
                    )}
                </div>
            </Card>
        </Badge.Ribbon>
    );
}
