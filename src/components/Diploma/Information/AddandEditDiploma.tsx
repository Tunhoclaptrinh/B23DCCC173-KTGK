import React, { useMemo } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { useModel } from 'umi';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const { Option } = Select;

interface AddEditDiplomaModalProps {
    visible: boolean;
    onCancel: () => void;
    onSave: (diplomaData: any) => void;
    editingDiploma?: any;
}

const AddEditDiplomaModal: React.FC<AddEditDiplomaModalProps> = ({
    visible, 
    onCancel, 
    onSave, 
    editingDiploma
}) => {
    const { 
        diplomaBooks, 
        graduationDecisions, 
        diplomaFieldTemplates,
        getGraduationDecisionsByBookId
    } = useModel('DiplomaManagement.diploma-model');

    const [form] = Form.useForm();
    const [filteredDecisions, setFilteredDecisions] = React.useState(graduationDecisions);

    // Dynamically generate form items based on field templates
    const DynamicFormFields = useMemo(() => {
        return diplomaFieldTemplates.map(template => {
            let formItem;
            switch(template.dataType) {
                case 'Date':
                    formItem = (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            rules={[{ required: template.isRequired }]}
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    );
                    break;
                case 'Number':
                    formItem = (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            rules={[{ required: template.isRequired, type: 'number' }]}
                        >
                            <Input type="number" />
                        </Form.Item>
                    );
                    break;
                default:
                    formItem = (
                        <Form.Item
                            key={template.id}
                            name={`additionalFields.${template.name}`}
                            label={template.name}
                            rules={[{ required: template.isRequired }]}
                        >
                            <Input />
                        </Form.Item>
                    );
            }
            return formItem;
        });
    }, [diplomaFieldTemplates]);

    // Update the method to filter graduation decisions when a book is selected
    const handleDiplomaBookChange = (bookId: string) => {
        const decisions = bookId 
            ? getGraduationDecisionsByBookId(bookId)
            : graduationDecisions;
        setFilteredDecisions(decisions);
        
        // Reset decision field when book changes
        form.setFieldsValue({ decisionId: undefined });
    };

    // Prepare initial form values if editing
    React.useEffect(() => {
        if (editingDiploma) {
            // Prepare form values
            const formValues = {
                ...editingDiploma,
                dateOfBirth: moment(editingDiploma.dateOfBirth),
                additionalFields: editingDiploma.additionalFields || {}
            };

            // Set book-specific decisions
            const decisions = getGraduationDecisionsByBookId(editingDiploma.diplomaBookId);
            setFilteredDecisions(decisions);

            form.setFieldsValue(formValues);
        } else {
            form.resetFields();
        }
    }, [editingDiploma]);

    const handleSubmit = (values: any) => {
        const diplomaInfoData = {
            id: editingDiploma ? editingDiploma.id : uuidv4(),
            diplomaBookId: values.diplomaBookId,
            decisionId: values.decisionId,
            diplomaSerialNumber: values.diplomaSerialNumber,
            studentId: values.studentId,
            fullName: values.fullName,
            dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
            additionalFields: values.additionalFields || {},
            bookEntryNumber: editingDiploma ? editingDiploma.bookEntryNumber : undefined
        };

        onSave(diplomaInfoData);
    };

    return (
        <Modal
            title={editingDiploma ? "Edit Diploma Information" : "Add New Diploma Information"}
            visible={visible}
            footer={null}
            width={800}
            onCancel={onCancel}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
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
                    <Select 
                        placeholder="Select Diploma Book"
                        onChange={(value) => handleDiplomaBookChange(value)}
                    >
                        {diplomaBooks.map(book => (
                            <Option key={book.id} value={book.id}>
                                {book.year} Book
                            </Option>
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
                        {filteredDecisions.map(decision => (
                            <Option key={decision.id} value={decision.id}>
                                {decision.decisionNumber} - {decision.issuanceDate}
                            </Option>
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
                {DynamicFormFields}

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {editingDiploma ? 'Update' : 'Add'} Diploma Information
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddEditDiplomaModal;