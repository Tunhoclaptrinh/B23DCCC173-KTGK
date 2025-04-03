import React, { useState } from 'react';
import { Modal, Descriptions, Button, Form, Input, Select, DatePicker, message } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';

interface DiplomaDetailsModalProps {
    diploma: any;
    onClose: () => void;
}

const DiplomaDetailsModal: React.FC<DiplomaDetailsModalProps> = ({ diploma, onClose }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [form] = Form.useForm();

    const { 
        diplomaBooks, 
        graduationDecisions, 
        diplomaFieldTemplates,
        updateDiplomaInformation,
        getGraduationDecisionsByBookId
    } = useModel('DiplomaManagement.diploma-model');

    // Prepare dynamic field templates for editing
    const renderDynamicEditFields = () => {
        return diplomaFieldTemplates.map(template => {
            const initialValue = diploma.additionalFields?.[template.name];
            
            switch(template.dataType) {
                case 'Date':
                    return (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            initialValue={initialValue ? moment(initialValue) : undefined}
                            rules={[{ required: template.isRequired }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    );
                case 'Number':
                    return (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            initialValue={initialValue}
                            rules={[
                                { required: template.isRequired, message: `${template.name} is required` },
                                { type: 'number', message: `${template.name} must be a number` }
                            ]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    );
                default:
                    return (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            initialValue={initialValue}
                            rules={[{ required: template.isRequired }]}
                        >
                            <Input />
                        </Form.Item>
                    );
            }
        });
    };

    // Handle form submission for updating diploma
    const handleUpdateDiploma = (values: any) => {
        const updatedDiplomaInfo = {
            ...diploma,
            ...values,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            additionalFields: values.additionalFields || {}
        };

        try {
            updateDiplomaInformation(updatedDiplomaInfo);
            message.success('Diploma Information Updated Successfully');
            setIsEditing(false);
            onClose();
        } catch (error) {
            message.error('Failed to update diploma information');
        }
    };

    // Render view mode
    const renderViewMode = () => {
        const diplomaBook = diplomaBooks.find(book => book.id === diploma.diplomaBookId);
        const graduationDecision = graduationDecisions.find(decision => decision.id === diploma.decisionId);

        return (
            <Descriptions 
                title="Diploma Information Details" 
                bordered 
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
            >
                <Descriptions.Item label="Diploma Serial Number">
                    {diploma.diplomaSerialNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Book Entry Number">
                    {diploma.bookEntryNumber}
                </Descriptions.Item>
                <Descriptions.Item label="Student ID">
                    {diploma.studentId}
                </Descriptions.Item>
                <Descriptions.Item label="Full Name">
                    {diploma.fullName}
                </Descriptions.Item>
                <Descriptions.Item label="Date of Birth">
                    {diploma.dateOfBirth}
                </Descriptions.Item>
                <Descriptions.Item label="Diploma Book">
                    {diplomaBook ? `${diplomaBook.year} Book` : 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Graduation Decision">
                    {graduationDecision 
                        ? `${graduationDecision.decisionNumber} (${graduationDecision.issuanceDate})`
                        : 'N/A'}
                </Descriptions.Item>

                {/* Render Dynamic Additional Fields */}
                {diplomaFieldTemplates.map(template => {
                    const value = diploma.additionalFields?.[template.name];
                    return value !== undefined ? (
                        <Descriptions.Item key={template.id} label={template.name}>
                            {value instanceof Date ? value.toLocaleDateString() : value}
                        </Descriptions.Item>
                    ) : null;
                })}
            </Descriptions>
        );
    };

    // Render edit mode
    const renderEditMode = () => {
        return (
            <Form
                form={form}
                layout="vertical"
                onFinish={handleUpdateDiploma}
                initialValues={{
                    ...diploma,
                    dateOfBirth: moment(diploma.dateOfBirth),
                    additionalFields: diploma.additionalFields || {}
                }}
            >
                <Form.Item
                    name="diplomaSerialNumber"
                    label="Diploma Serial Number"
                    rules={[{ required: true, message: 'Please input diploma serial number' }]}
                >
                    <Input placeholder="Enter diploma serial number" />
                </Form.Item>

                <Form.Item
                    name="diplomaBookId"
                    label="Diploma Book"
                    rules={[{ required: true, message: 'Please select diploma book' }]}
                >
                    <Select placeholder="Select Diploma Book">
                        {diplomaBooks.map(book => (
                            <Select.Option key={book.id} value={book.id}>
                                {book.year} Book
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="decisionId"
                    label="Graduation Decision"
                    rules={[{ required: true, message: 'Please select graduation decision' }]}
                >
                    <Select 
                        placeholder="Select Graduation Decision"
                        disabled={!form.getFieldValue('diplomaBookId')}
                    >
                        {getGraduationDecisionsByBookId(form.getFieldValue('diplomaBookId')).map(decision => (
                            <Select.Option key={decision.id} value={decision.id}>
                                {decision.decisionNumber} - {decision.issuanceDate}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="studentId"
                    label="Student ID"
                    rules={[{ required: true, message: 'Please input student ID' }]}
                >
                    <Input placeholder="Enter student ID" />
                </Form.Item>

                <Form.Item
                    name="fullName"
                    label="Full Name"
                    rules={[{ required: true, message: 'Please input full name' }]}
                >
                    <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item
                    name="dateOfBirth"
                    label="Date of Birth"
                    rules={[{ required: true, message: 'Please select date of birth' }]}
                >
                    <DatePicker style={{ width: '100%' }} />
                </Form.Item>

                {/* Dynamic Additional Fields */}
                {renderDynamicEditFields()}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Diploma Information
                    </Button>
                    <Button 
                        type="default" 
                        onClick={() => setIsEditing(false)} 
                        style={{ marginLeft: 8 }}
                    >
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        );
    };

    return (
        <Modal
            title={isEditing ? "Edit Diploma Information" : "Diploma Information Details"}
            visible={true}
            onCancel={onClose}
            footer={
                isEditing ? null : [
                    <Button key="close" onClick={onClose}>
                        Close
                    </Button>,
                    <Button key="edit" type="primary" onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                ]
            }
            width={800}
        >
            {isEditing ? renderEditMode() : renderViewMode()}
        </Modal>
    );
};

export default DiplomaDetailsModal;