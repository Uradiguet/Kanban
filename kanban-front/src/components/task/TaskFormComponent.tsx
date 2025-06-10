"use client";

import React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import Task from '@/models/Task';
import User from '@/models/User';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

interface TaskFormComponentProps {
    task?: Task;
    users: User[];
    onSubmit: (values: any) => void;
    onCancel: () => void;
    loading?: boolean;
}

export default function TaskFormComponent({ 
    task, 
    users, 
    onSubmit, 
    onCancel, 
    loading = false 
}: TaskFormComponentProps) {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (task) {
            form.setFieldsValue({
                ...task,
                dueDate: task.dueDate ? dayjs(task.dueDate) : null
            });
        } else {
            form.resetFields();
        }
    }, [task, form]);

    const handleSubmit = (values: any) => {
        const formattedValues = {
            ...values,
            dueDate: values.dueDate ? values.dueDate.format('YYYY-MM-DD') : null,
            assignedUsers: values.assignedUsers || []
        };
        onSubmit(formattedValues);
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
                priority: 'medium',
                assignedUsers: []
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

            <div className="flex gap-2 justify-end">
                <Button onClick={onCancel}>
                    Annuler
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
                    {task ? 'Modifier' : 'Créer'}
                </Button>
            </div>
        </Form>
    );
}
