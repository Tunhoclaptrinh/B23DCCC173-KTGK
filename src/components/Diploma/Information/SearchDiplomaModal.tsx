import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { useModel } from 'umi';

const { Option } = Select;

interface SearchDiplomaModalProps {
    visible: boolean;
    onCancel: () => void;
    onSearch: (searchCriteria: any) => void;
}

const SearchDiplomaModal: React.FC<SearchDiplomaModalProps> = ({
    visible, 
    onCancel, 
    onSearch
}) => {
    const { 
        diplomaBooks, 
        graduationDecisions,
        getGraduationDecisionsByBookId 
    } = useModel('DiplomaManagement.diploma-model');

    const [searchForm] = Form.useForm();
    const [filteredDecisions, setFilteredDecisions] = useState(graduationDecisions);

    const handleSearch = (values: any) => {
        const searchCriteria = {
            diplomaSerialNumber: values.diplomaSerialNumber,
            studentId: values.studentId,
            fullName: values.fullName,
            diplomaBookId: values.diplomaBookId,
            decisionId: values.decisionId
        };

        // Remove undefined values
        Object.keys(searchCriteria).forEach(key => 
            searchCriteria[key] === undefined && delete searchCriteria[key]
        );

        onSearch(searchCriteria);
    };

    const handleDiplomaBookChange = (value: string) => {
        const decisions = value 
            ? getGraduationDecisionsByBookId(value)
            : graduationDecisions;
        setFilteredDecisions(decisions);
        searchForm.setFieldsValue({ decisionId: undefined });
    };

    return (
        <Modal
            title="Search Diplomas"
            visible={visible}
            footer={null}
            width={600}
            onCancel={onCancel}
        >
            <Form
                form={searchForm}
                layout="vertical"
                onFinish={handleSearch}
            >
                <Form.Item
                    name="diplomaSerialNumber"
                    label="Diploma Serial Number"
                >
                    <Input placeholder="Enter diploma serial number" />
                </Form.Item>

                <Form.Item
                    name="diplomaBookId"
                    label="Diploma Book"
                >
                    <Select 
                        placeholder="Select Diploma Book" 
                        allowClear
                        onChange={handleDiplomaBookChange}
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
                >
                    <Select 
                        placeholder="Select Graduation Decision" 
                        allowClear
                        disabled={!searchForm.getFieldValue('diplomaBookId')}
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
                >
                    <Input placeholder="Enter student ID" />
                </Form.Item>

                <Form.Item
                    name="fullName"
                    label="Full Name"
                >
                    <Input placeholder="Enter full name" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Search
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default SearchDiplomaModal;