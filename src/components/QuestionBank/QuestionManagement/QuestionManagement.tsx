import React, { useState } from 'react';
import { Table, Button, Modal, Popconfirm } from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import QuestionForm from '../../Form/QuestionForm';

const QuestionManagement: React.FC = () => {
    const { courses, questions, addQuestion, updateQuestion, deleteQuestion } = useModel('questionbank');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const handleAdd = () => {
        setEditingQuestion(null);
        setIsModalVisible(true);
    };

    const handleEdit = (question: any) => {
        setEditingQuestion(question);
        setIsModalVisible(true);
    };

    const handleDelete = (questionId: string) => {
        deleteQuestion(questionId);
    };

    const handleSubmit = (values: any) => {
        if (editingQuestion) {
            // Cập nhật câu hỏi
            updateQuestion({ ...editingQuestion, ...values });
        } else {
            // Thêm câu hỏi mới
            addQuestion({
                id: uuidv4(),
                ...values
            });
        }
        setIsModalVisible(false);
    };

    const columns = [
        {
            title: 'Content',
            dataIndex: 'content',
            key: 'content',
        },
        {
            title: 'Course',
            dataIndex: 'courseId',
            key: 'courseId', 
            render: (courseId: string) => 
                courses.find(c => c.id === courseId)?.name || courseId
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficultyLevel',
            key: 'difficultyLevel',
        },
        {
            title: 'Knowledge Area',
            dataIndex: 'knowledgeArea',
            key: 'knowledgeArea',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure to delete this question?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
                Add Question
            </Button>

            <Table columns={columns} dataSource={questions} rowKey="id" />

            {/* Modal Form */}
            <Modal
                title={editingQuestion ? "Edit Question" : "Add Question"}
                visible={isModalVisible}
                footer={null}
                onCancel={() => setIsModalVisible(false)}
            >
                <QuestionForm 
                    onSubmit={handleSubmit} 
                    courses={courses} 
                    initialValues={editingQuestion} 
                />
            </Modal>
        </div>
    );
};

export default QuestionManagement;
