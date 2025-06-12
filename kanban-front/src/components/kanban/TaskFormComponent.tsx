"use client";

import React from 'react';
import { Form, Input, Select, DatePicker, Button, message } from 'antd';
import Task from '@/models/Task';
import User from '@/models/User';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormComponentProps {
    task?: Task;
    users: User[];
    allTasks: Task[];
    onSubmit: (values: any) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function TaskFormComponent({ 
    task, 
    users,
    allTasks,
    onSubmit, 
    onCancel, 
    loading = false 
}: TaskFormComponentProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (task) {
            form.setFieldsValue({
                ...task,
                dueDate: task.dueDate ? dayjs(task.dueDate) : null,
                dependencies: task.dependencies.map(dep => dep.targetTaskId)
            });
        } else {
            form.resetFields();
        }
    }, [task, form]);

    const handleSubmit = async (values: any) => {
        console.log('Form submitted with values:', values);
        // Vérifier si la tâche a des dépendances non terminées
        if (values.dependencies && values.dependencies.length > 0) {
            const incompleteDependencies = values.dependencies.filter((depId: string) => {
                const dependencyTask = allTasks.find(t => t.id === depId);
                return dependencyTask && dependencyTask.status !== 'DONE';
            });

            if (incompleteDependencies.length > 0 && values.status === 'IN_PROGRESS') {
                message.error('Impossible de mettre la tâche en cours car certaines dépendances ne sont pas terminées');
                return;
            }
        }

        const formattedValues = {
            ...values,
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
            assignedUsers: values.assignedUsers || [],
            dependencies: values.dependencies || []
        };
        console.log('Formatted values:', formattedValues);
        onSubmit(formattedValues);
    };

    const availableDependencies = allTasks.filter(t => 
        t.id !== task?.id && // Ne pas inclure la tâche elle-même
        !task?.dependencies.some(dep => dep.targetTaskId === t.id) && // Ne pas inclure les dépendances existantes
        t.status !== 'DONE' // Ne pas inclure les tâches terminées
    );

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                priority: 'medium',
                assignedUsers: [],
                dependencies: [],
                status: 'TODO'
            }}
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
                >
                    <Select>
                        <Option value="low">Basse</Option>
                        <Option value="medium">Moyenne</Option>
                        <Option value="high">Haute</Option>
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
                    filterOption={(input, option) =>
                        (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    {users.map(user => (
                        <Option key={user.id} value={user.id!}>
                            {user.firstname} {user.lastname} ({user.username})
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="dependencies"
                label="Dépendances"
                help="Sélectionnez les tâches dont celle-ci dépend"
            >
                <Select
                    mode="multiple"
                    placeholder="Sélectionnez les tâches dépendantes"
                    optionFilterProp="children"
                    showSearch
                >
                    {availableDependencies.map(t => (
                        <Option key={t.id} value={t.id!}>
                            {t.title}
                        </Option>
                    ))}
                </Select>
            </Form.Item>

            <Form.Item
                name="status"
                label="Statut"
            >
                <Select>
                    <Option value="TODO">À faire</Option>
                    <Option value="IN_PROGRESS">En cours</Option>
                    <Option value="DONE">Terminé</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <div className="flex justify-end gap-2">
                    <Button onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {task ? 'Mettre à jour' : 'Créer'}
                    </Button>
                </div>
            </Form.Item>
        </Form>
    );
}
