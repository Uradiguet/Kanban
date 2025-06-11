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
    const [taskForm] = Form.useForm();
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

        try {
            const response = await KanbanService.moveTask(
                draggedTask.id!,
                draggedFrom!,
                toBoardId
            );

            if (response.status === 200) {
                setTasks(prevTasks => 
                    prevTasks.map(task => 
                        task.id === draggedTask.id 
                            ? { ...task, boardId: toBoardId }
                            : task
                    )
                );
                message.success('Tâche déplacée avec succès');
            }
        } catch (error) {
            message.error('Erreur lors du déplacement de la tâche');
        }

        setDraggedTask(null);
        setDraggedFrom(null);
    };

    const handleCreateTask = async (values: any) => {
        try {
            const taskData = {
                ...values,
                boardId: selectedBoardId,
                dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
                assignedUsers: values.assignedUsers || []
            };

            const response = await KanbanService.createTask(taskData);
            
            if (response.status === 201 && response.data) {
                setTasks(prev => [...prev, response.data]);
                message.success('Tâche créée avec succès');
                setShowTaskModal(false);
                taskForm.resetFields();
            }
        } catch (error) {
            message.error('Erreur lors de la création de la tâche');
        }
    };

    const handleUpdateTask = async (values: any) => {
        if (!editingTask) return;

        try {
            const taskData = {
                ...values,
                dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
                assignedUsers: values.assignedUsers || []
            };

            const response = await KanbanService.updateTask(editingTask.id!, taskData);
            
            if (response.status === 200 && response.data) {
                setTasks(prev => 
                    prev.map(task => 
                        task.id === editingTask.id ? response.data : task
                    )
                );
                message.success('Tâche mise à jour avec succès');
                setEditingTask(null);
                taskForm.resetFields();
            }
        } catch (error) {
            message.error('Erreur lors de la mise à jour de la tâche');
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
            taskForm.setFieldsValue({
                ...task,
                dueDate: task.dueDate ? dayjs(task.dueDate) : null
            });
        } else {
            setEditingTask(null);
            taskForm.resetFields();
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
                    <Form
                        form={taskForm}
                        layout="vertical"
                        onFinish={editingTask ? handleUpdateTask : handleCreateTask}
                    >
                        <Form.Item
                            name="title"
                            label="Titre"
                            rules={[{ required: true, message: 'Le titre est requis' }]}
                        >
                            <Input placeholder="Titre de la tâche" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Description"
                        >
                            <TextArea rows={3} placeholder="Description de la tâche" />
                        </Form.Item>

                        <div className="grid grid-cols-2 gap-4">
                            <Form.Item
                                name="priority"
                                label="Priorité"
                                initialValue="medium"
                            >
                                <Select>
                                    <Option value="LOW">Basse</Option>
                                    <Option value="MEDIUM">Moyenne</Option>
                                    <Option value="HIGH">Haute</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="dueDate"
                                label="Date d'échéance"
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="assignedUsers"
                            label="Assigné à"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Sélectionner des utilisateurs"
                                optionFilterProp="children"
                            >
                                {projectUsers.map(user => (
                                    <Option key={user.id} value={user.id!}>
                                        {user.firstname} {user.lastname} ({user.username})
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => setShowTaskModal(false)}>
                                Annuler
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingTask ? 'Modifier' : 'Créer'}
                            </Button>
                        </div>
                    </Form>
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
