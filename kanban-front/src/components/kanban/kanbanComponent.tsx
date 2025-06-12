"use client";

import React, { useState, useEffect } from 'react';
import { 
    Button, 
    Modal, 
    Form, 
    Input, 
    Select, 
    DatePicker, 
    Card, 
    Tag, 
    Avatar, 
    Tooltip, 
    message,
    Popconfirm,
    Badge
} from 'antd';
import { 
    PlusOutlined, 
    EditOutlined, 
    DeleteOutlined, 
    CalendarOutlined, 
    UserOutlined,
    FlagOutlined
} from '@ant-design/icons';
import KanbanService from '@/services/KanbanService';
import HttpService from '@/services/HttpService';
import API_URLS from '@/constants/ApiUrls';
import Task from '@/models/Task';
import Board from '@/models/Board';
import User from '@/models/User';
import dayjs from 'dayjs';
import TaskFormComponent from './TaskFormComponent';

const { TextArea } = Input;
const { Option } = Select;

interface KanbanComponentProps {
    initialBoards?: Board[];
    initialTasks?: Task[];
    users?: User[];
}

export default function KanbanComponent({ 
    initialBoards = [], 
    initialTasks = [], 
    users = [] 
}: KanbanComponentProps) {
    const [boards, setBoards] = useState<Board[]>(initialBoards);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [projectUsers, setProjectUsers] = useState<User[]>(users);
    const [loading, setLoading] = useState(false);
    
    // Modal states
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showBoardModal, setShowBoardModal] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
    
    // Drag and drop
    const [draggedTask, setDraggedTask] = useState<Task | null>(null);
    const [draggedFrom, setDraggedFrom] = useState<string | null>(null);

    // Forms
    const [boardForm] = Form.useForm();

    const priorityColors = {
        low: '#52c41a',
        medium: '#faad14',
        high: '#f5222d'
    };

    const boardColors = [
        'bg-red-100 border-red-300',
        'bg-yellow-100 border-yellow-300',
        'bg-blue-100 border-blue-300',
        'bg-green-100 border-green-300',
        'bg-purple-100 border-purple-300',
        'bg-pink-100 border-pink-300',
        'bg-indigo-100 border-indigo-300',
        'bg-gray-100 border-gray-300'
    ];

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [boardsResponse, tasksResponse, usersResponse] = await Promise.all([
                KanbanService.getBoards(),
                KanbanService.getTasks(),
                HttpService.get<User[]>(API_URLS.users)
            ]);

            if (boardsResponse.status === 200 && boardsResponse.data) {
                setBoards(boardsResponse.data);
            }
            if (tasksResponse.status === 200 && tasksResponse.data) {
                setTasks(tasksResponse.data);
            }
            if (usersResponse.status === 200 && usersResponse.data) {
                setProjectUsers(usersResponse.data);
            }
        } catch (error) {
            message.error('Erreur lors du chargement des données');
        } finally {
            setLoading(false);
        }
    };

    const getTasksForBoard = (boardId: string) => {
        return tasks.filter(task => task.boardId === boardId);
    };

    const handleDragStart = (e: React.DragEvent, task: Task) => {
        setDraggedTask(task);
        setDraggedFrom(task.boardId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = async (e: React.DragEvent, toBoardId: string) => {
        e.preventDefault();
        
        if (!draggedTask || draggedFrom === toBoardId) {
            setDraggedTask(null);
            setDraggedFrom(null);
            return;
        }

        // Vérifier si la tâche est bloquée par des dépendances
        const blockingTasks = draggedTask.dependencies
            .map(dep => tasks.find(t => t.id === dep.targetTaskId))
            .filter(t => t && t.status !== 'DONE');
        const isBlocked = blockingTasks.length > 0;

        // Si la tâche est bloquée et qu'on essaie de la déplacer vers "En cours" ou "Terminé"
        if (isBlocked) {
            const targetBoard = boards.find(b => b.id === toBoardId);
            if (targetBoard && (targetBoard.title === 'En cours' || targetBoard.title === 'Terminé')) {
                const blockingNames = blockingTasks.map(t => t.title).join(', ');
                setTimeout(() => {
                  message.error(`Cette tâche ne peut pas être déplacée car elle dépend de : ${blockingNames}`);
                }, 100);
                setDraggedTask(null);
                setDraggedFrom(null);
                return;
            }
        }

        try {
            const response = await KanbanService.moveTask(
                draggedTask.id!,
                draggedFrom!,
                toBoardId
            );

            if (response.status === 200) {
                // Mettre à jour le statut de la tâche en fonction du tableau de destination
                const targetBoard = boards.find(b => b.id === toBoardId);
                let newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE' = 'TODO';
                
                if (targetBoard) {
                    if (targetBoard.title === 'En cours') {
                        newStatus = 'IN_PROGRESS';
                    } else if (targetBoard.title === 'Terminé') {
                        newStatus = 'DONE';
                    }
                }

                // Mettre à jour le statut de la tâche
                await KanbanService.updateTaskStatus(draggedTask.id!, newStatus);

                // Mettre à jour l'état local
                setTasks(prevTasks => 
                    prevTasks.map(task => {
                        if (task.id === draggedTask.id) {
                            const updatedTask = new Task();
                            Object.assign(updatedTask, {
                                ...task,
                                boardId: toBoardId,
                                status: newStatus
                            });
                            return updatedTask;
                        }
                        return task;
                    })
                );

                // Vérifier si d'autres tâches peuvent maintenant être débloquées
                const updatedTasks = tasks.map(task => {
                    if (task.id === draggedTask.id) {
                        const updatedTask = new Task();
                        Object.assign(updatedTask, {
                            ...task,
                            boardId: toBoardId,
                            status: newStatus
                        });
                        return updatedTask;
                    }
                    return task;
                });

                // Notifier les utilisateurs des tâches débloquées
                const newlyUnblockedTasks = updatedTasks.filter(task => {
                    const wasBlocked = task.dependencies.some(dep => {
                        const dependentTask = tasks.find(t => t.id === dep.targetTaskId);
                        return dependentTask && dependentTask.status !== 'DONE';
                    });
                    const isNowUnblocked = !task.dependencies.some(dep => {
                        const dependentTask = updatedTasks.find(t => t.id === dep.targetTaskId);
                        return dependentTask && dependentTask.status !== 'DONE';
                    });
                    return wasBlocked && isNowUnblocked;
                });

                if (newlyUnblockedTasks.length > 0) {
                    message.success(`${newlyUnblockedTasks.length} tâche(s) peuvent maintenant commencer !`);
                }

                message.success('Tâche déplacée avec succès');
            }
        } catch (error: any) {
            console.error('Erreur lors du déplacement de la tâche:', error);
            let msg = error.message;
            if (msg && msg.startsWith('Erreur lors du déplacement:')) {
                msg = msg.replace('Erreur lors du déplacement:', '').trim();
            }
            message.error(msg || 'Erreur lors du déplacement de la tâche');
            setDraggedTask(null);
            setDraggedFrom(null);
        }
    };

    const handleCreateTask = async (values: any) => {
        console.log('Creating task with values:', values);
        setLoading(true);
        try {
            // Vérifier les dépendances avant de créer la tâche
            if (values.dependencies && values.dependencies.length > 0) {
                const incompleteDependencies = values.dependencies.filter((depId: string) => {
                    const dependencyTask = tasks.find(t => t.id === depId);
                    return dependencyTask && dependencyTask.status !== 'DONE';
                });

                if (incompleteDependencies.length > 0 && values.status === 'IN_PROGRESS') {
                    message.error('Impossible de créer la tâche en cours car certaines dépendances ne sont pas terminées');
                    setLoading(false);
                    return;
                }
            }

            const taskData = {
                ...values,
                boardId: selectedBoardId,
                dueDate: values.dueDate
                  ? (typeof values.dueDate.format === 'function'
                      ? values.dueDate.format('YYYY-MM-DD')
                      : values.dueDate)
                  : null,
                assignedUsers: values.assignedUsers || [],
                status: values.status || 'TODO'
            };

            console.log('Sending task data to API:', taskData);
            const response = await KanbanService.createTask(taskData);
            console.log('API response:', response);
            
            if (response.status === 201 && response.data) {
                // Ajouter les dépendances après la création de la tâche
                if (values.dependencies && values.dependencies.length > 0) {
                    try {
                        await Promise.all(values.dependencies.map((targetTaskId: string) =>
                            KanbanService.addDependency(response.data.id!, targetTaskId)
                        ));
                        // Récupérer la tâche mise à jour avec les dépendances
                        const updatedTaskResponse = await KanbanService.getTasks();
                        if (updatedTaskResponse.status === 200 && updatedTaskResponse.data) {
                            const updatedTask = updatedTaskResponse.data.find(t => t.id === response.data.id);
                            if (updatedTask) {
                                setTasks(prev => [...prev.filter(t => t.id !== response.data.id), updatedTask]);
                                message.success('Tâche créée avec succès');
                                setShowTaskModal(false);
                                return;
                            }
                        }
                    } catch (error) {
                        console.error('Error adding dependencies:', error);
                        message.error('Erreur lors de l\'ajout des dépendances');
                        setLoading(false);
                        return;
                    }
                }
                setTasks(prev => [...prev, response.data]);
                message.success('Tâche créée avec succès');
                setShowTaskModal(false);
            } else {
                console.error('Error creating task:', response);
                message.error('Erreur lors de la création de la tâche');
            }
        } catch (error) {
            console.error('Error in handleCreateTask:', error);
            message.error('Erreur lors de la création de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateTask = async (values: any) => {
        console.log('Updating task with values:', values);
        if (!editingTask) return;
        setLoading(true);
        try {
            // Vérifier les dépendances avant de mettre à jour la tâche
            if (values.dependencies && values.dependencies.length > 0) {
                const incompleteDependencies = values.dependencies.filter((depId: string) => {
                    const dependencyTask = tasks.find(t => t.id === depId);
                    return dependencyTask && dependencyTask.status !== 'DONE';
                });

                if (incompleteDependencies.length > 0 && values.status === 'IN_PROGRESS') {
                    message.error('Impossible de mettre la tâche en cours car certaines dépendances ne sont pas terminées');
                    setLoading(false);
                    return;
                }
            }

            const taskData = {
                ...values,
                dueDate: values.dueDate
                  ? (typeof values.dueDate.format === 'function'
                      ? values.dueDate.format('YYYY-MM-DD')
                      : values.dueDate)
                  : null,
                assignedUsers: values.assignedUsers || [],
                status: values.status || editingTask.status
            };

            console.log('Sending task data to API:', taskData);
            const response = await KanbanService.updateTask(editingTask.id!, taskData);
            console.log('API response:', response);
            
            if (response.status === 200 && response.data) {
                // Mettre à jour les dépendances
                if (values.dependencies) {
                    try {
                        // Supprimer toutes les dépendances existantes
                        const currentDependencies = editingTask.dependencies.map(dep => dep.targetTaskId);
                        await Promise.all(currentDependencies.map(targetTaskId =>
                            KanbanService.removeDependency(editingTask.id!, targetTaskId)
                        ));

                        // Ajouter les nouvelles dépendances
                        await Promise.all(values.dependencies.map((targetTaskId: string) =>
                            KanbanService.addDependency(editingTask.id!, targetTaskId)
                        ));

                        // Récupérer la tâche mise à jour avec les dépendances
                        const updatedTaskResponse = await KanbanService.getTasks();
                        if (updatedTaskResponse.status === 200 && updatedTaskResponse.data) {
                            const updatedTask = updatedTaskResponse.data.find(t => t.id === editingTask.id);
                            if (updatedTask) {
                                setTasks(prev => 
                                    prev.map(task => 
                                        task.id === editingTask.id ? updatedTask : task
                                    )
                                );
                                message.success('Tâche mise à jour avec succès');
                                setEditingTask(null);
                                setShowTaskModal(false);
                                return;
                            }
                        }
                    } catch (error) {
                        console.error('Error updating dependencies:', error);
                        message.error('Erreur lors de la mise à jour des dépendances');
                        setLoading(false);
                        return;
                    }
                }
                setTasks(prev => 
                    prev.map(task => 
                        task.id === editingTask.id ? response.data : task
                    )
                );
                message.success('Tâche mise à jour avec succès');
                setEditingTask(null);
                setShowTaskModal(false);
            } else {
                console.error('Error updating task:', response);
                message.error('Erreur lors de la mise à jour de la tâche');
            }
        } catch (error) {
            console.error('Error in handleUpdateTask:', error);
            message.error('Erreur lors de la mise à jour de la tâche');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        try {
            const response = await KanbanService.deleteTask(taskId);
            
            if (response.status === 204) {
                setTasks(prev => prev.filter(task => task.id !== taskId));
                message.success('Tâche supprimée avec succès');
            }
        } catch (error) {
            message.error('Erreur lors de la suppression de la tâche');
        }
    };

    const handleCreateBoard = async (values: any) => {
        try {
            const response = await KanbanService.createBoard(values);
            
            if (response.status === 201 && response.data) {
                setBoards(prev => [...prev, response.data]);
                message.success('Colonne créée avec succès');
                setShowBoardModal(false);
                boardForm.resetFields();
            }
        } catch (error) {
            message.error('Erreur lors de la création de la colonne');
        }
    };

    const handleDeleteBoard = async (boardId: string) => {
        try {
            const response = await KanbanService.deleteBoard(boardId);
            
            if (response.status === 204) {
                setBoards(prev => prev.filter(board => board.id !== boardId));
                setTasks(prev => prev.filter(task => task.boardId !== boardId));
                message.success('Colonne supprimée avec succès');
            }
        } catch (error) {
            message.error('Erreur lors de la suppression de la colonne');
        }
    };

    const openTaskModal = (boardId: string, task?: Task) => {
        setSelectedBoardId(boardId);
        if (task) {
            setEditingTask(task);
        } else {
            setEditingTask(null);
        }
        setShowTaskModal(true);
    };

    const getUserById = (userId: string) => {
        return projectUsers.find(user => user.id === userId);
    };

    const isOverdue = (dueDate: string) => {
        if (!dueDate) return false;
        return dayjs(dueDate).isBefore(dayjs(), 'day');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-4xl font-bold text-gray-800">Tableau Kanban</h1>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setShowBoardModal(true)}
                        >
                            Nouvelle colonne
                        </Button>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-6 overflow-x-auto pb-6">
                    {boards.map(board => {
                        const boardTasks = getTasksForBoard(board.id!);
                        
                        return (
                            <div
                                key={board.id}
                                className={`flex-shrink-0 w-80 ${board.color} rounded-lg border-2 border-dashed p-4`}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, board.id!)}
                            >
                                {/* Column Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                        {board.title}
                                        <Badge count={boardTasks.length} showZero color="#108ee9" />
                                    </h2>
                                    <div className="flex gap-2">
                                        <Button
                                            type="text"
                                            icon={<PlusOutlined />}
                                            size="small"
                                            onClick={() => openTaskModal(board.id!)}
                                        />
                                        <Popconfirm
                                            title="Supprimer cette colonne ?"
                                            description="Toutes les tâches de cette colonne seront supprimées."
                                            onConfirm={() => handleDeleteBoard(board.id!)}
                                            okText="Oui"
                                            cancelText="Non"
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                size="small"
                                                danger
                                            />
                                        </Popconfirm>
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="space-y-3">
                                    {boardTasks.map(task => (
                                        <Card
                                            key={task.id}
                                            size="small"
                                            className="cursor-move hover:shadow-md transition-shadow"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, task)}
                                            actions={[
                                                <EditOutlined 
                                                    key="edit" 
                                                    onClick={() => openTaskModal(board.id!, task)} 
                                                />,
                                                <Popconfirm
                                                    key="delete"
                                                    title="Supprimer cette tâche ?"
                                                    onConfirm={() => handleDeleteTask(task.id!)}
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
                                                    <p className="text-sm text-gray-600">
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
                                                        {task.priority}
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
                                                                        >
                                                                            {user ? user.firstname?.[0] : '?'}
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
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Task Modal */}
                <Modal
                    title={editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
                    open={showTaskModal}
                    onCancel={() => setShowTaskModal(false)}
                    footer={null}
                    width={600}
                >
                    <TaskFormComponent
                        task={editingTask}
                        users={projectUsers}
                        allTasks={tasks}
                        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                        onCancel={() => setShowTaskModal(false)}
                        loading={loading}
                    />
                </Modal>

                {/* Board Modal */}
                <Modal
                    title="Nouvelle colonne"
                    open={showBoardModal}
                    onCancel={() => setShowBoardModal(false)}
                    footer={null}
                >
                    <Form
                        form={boardForm}
                        layout="vertical"
                        onFinish={handleCreateBoard}
                    >
                        <Form.Item
                            name="title"
                            label="Nom de la colonne"
                            rules={[{ required: true, message: 'Le nom est requis' }]}
                        >
                            <Input placeholder="Nom de la colonne" />
                        </Form.Item>

                        <Form.Item
                            name="color"
                            label="Couleur"
                            initialValue="bg-gray-100 border-gray-300"
                        >
                            <Select>
                                {boardColors.map((color, index) => (
                                    <Option key={index} value={color}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-4 h-4 rounded ${color}`} />
                                            Couleur {index + 1}
                                        </div>
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => setShowBoardModal(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Créer
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </div>
    );
}
