import React, { useState } from 'react';
import { 
    Table, 
    Button, 
    Modal, 
    Form, 
    Input, 
    DatePicker, 
    Popconfirm, 
    message 
} from 'antd';
import { useModel } from 'umi';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const DiplomaBookManagement: React.FC = () => {
    const { 
        diplomaBooks, 
        addDiplomaBook, 
        updateDiplomaBook, 
        deleteDiplomaBook,
        getDiplomaStatistics,
        exportDiplomaData,
        importDiplomaData,
        getDiplomasByBookId
    } = useModel('DiplomaManagement.diploma-model');

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDiplomasModalVisible, setIsDiplomasModalVisible] = useState(false);
    const [selectedBookDiplomas, setSelectedBookDiplomas] = useState<any[]>([]);
    const [editingBook, setEditingBook] = useState<any>(null);
    const [form] = Form.useForm();

    const handleViewDiplomas = (book: any) => {
        const diplomas = getDiplomasByBookId(book.id);
        setSelectedBookDiplomas(diplomas);
        setIsDiplomasModalVisible(true);
    };

    // Updated handleSaveBook method to handle potential errors
    const handleSaveBook = (values: any) => {
        const bookData = {
            id: editingBook ? editingBook.id : uuidv4(),
            year: values.year.year(), // Extract year from DatePicker
            startDate: values.startDate.format('YYYY-MM-DD'),
            endDate: values.endDate.format('YYYY-MM-DD'),
            currentEntryNumber: editingBook ? editingBook.currentEntryNumber : 0
        };

        try {
            if (editingBook) {
                // Edit existing book
                updateDiplomaBook(bookData);
                message.success('Diploma Book Updated Successfully');
            } else {
                // Add new book
                addDiplomaBook(bookData);
                message.success('Diploma Book Added Successfully');
            }

            setIsModalVisible(false);
            setEditingBook(null);
            form.resetFields();
        } catch (error) {
            // Handle the specific error for duplicate year
            if (error instanceof Error && error.message.includes('diploma book already exists')) {
                message.error(error.message);
            } else {
                // Handle any other unexpected errors
                message.error('Failed to save diploma book. Please try again.');
                console.error(error);
            }
        }
    };

    // Handle edit
    const handleEdit = (book: any) => {
        setEditingBook(book);
        form.setFieldsValue({
            year: moment().year(book.year),
            startDate: moment(book.startDate),
            endDate: moment(book.endDate)
        });
        setIsModalVisible(true);
    };

    // Handle delete
    const handleDelete = (bookId: string) => {
        deleteDiplomaBook(bookId);
        message.success('Diploma Book Deleted Successfully');
    };

    // Show statistics
    const showStatistics = () => {
        const stats = getDiplomaStatistics();
        Modal.info({
            title: 'Diploma Management Statistics',
            content: (
                <div>
                    <p>Total Diplomas: {stats.totalDiplomas}</p>
                    <p>Total Books: {stats.totalBooks}</p>
                    <p>Total Graduation Decisions: {stats.totalDecisions}</p>
                    <p>Total Lookups: {stats.totalLookups}</p>
                    <h4>Diplomas by Year:</h4>
                    {Object.entries(stats.diplomasByYear).map(([year, count]) => (
                        <p key={year}>{year}: {count} diplomas</p>
                    ))}
                </div>
            ),
            width: 520,
        });
    };

    // Export diploma data
    const handleExport = () => {
        const data = exportDiplomaData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'diploma_data_export.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        message.success('Diploma Data Exported Successfully');
    };

    // Import diploma data
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target?.result as string);
                importDiplomaData(jsonData);
                message.success('Diploma Data Imported Successfully');
            } catch (error) {
                message.error('Failed to import diploma data');
            }
        };
        
        if (event.target.files && event.target.files.length > 0) {
            fileReader.readAsText(event.target.files[0]);
        }
    };

    const columns = [
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
        },
        {
            title: 'Current Entry Number',
            dataIndex: 'currentEntryNumber',
            key: 'currentEntryNumber',
        },
        {
            title: 'Diplomas',
            key: 'diplomas',
            render: (_, record) => (
                <Button 
                    type="link" 
                    onClick={() => handleViewDiplomas(record)}
                >
                    View Diplomas
                </Button>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>Edit</Button>
                    <Popconfirm
                        title="Are you sure you want to delete this diploma book?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>Delete</Button>
                    </Popconfirm>
                </div>
            ),
        }
    ];

    const diplomasColumns = [
        {
            title: 'Diploma Serial Number',
            dataIndex: 'diplomaSerialNumber',
            key: 'diplomaSerialNumber',
        },
        {
            title: 'Full Name',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Student ID',
            dataIndex: 'studentId',
            key: 'studentId',
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
        },
        {
            title: 'Book Entry Number',
            dataIndex: 'bookEntryNumber',
            key: 'bookEntryNumber',
        }
    ];


    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button 
                        type="primary" 
                        style={{ marginRight: 8 }} 
                        onClick={() => {
                            setEditingBook(null); 
                            form.resetFields();
                            setIsModalVisible(true);
                        }}
                    >
                        Add Diploma Book
                    </Button>
                    <Button 
                        type="default" 
                        style={{ marginRight: 8 }} 
                        onClick={showStatistics}
                    >
                        View Statistics
                    </Button>
                    <Button 
                        type="default" 
                        style={{ marginRight: 8 }} 
                        onClick={handleExport}
                    >
                        Export Data
                    </Button>
                    <input 
                        type="file" 
                        accept=".json" 
                        style={{ display: 'none' }} 
                        id="import-file"
                        onChange={handleImport}
                    />
                    <label htmlFor="import-file">
                        <Button type="default" component="span">
                            Import Data
                        </Button>
                    </label>
                </div>
            </div>

            <Table 
                columns={columns} 
                dataSource={diplomaBooks} 
                rowKey="id" 
            />

            {/* Diplomas Modal */}
            <Modal
                title="Diplomas in Book"
                visible={isDiplomasModalVisible}
                footer={null}
                onCancel={() => setIsDiplomasModalVisible(false)}
                width={800}
            >
                <Table 
                    columns={diplomasColumns} 
                    dataSource={selectedBookDiplomas} 
                    rowKey="diplomaNumber"
                    locale={{
                        emptyText: 'No diplomas found in this book'
                    }}
                />
            </Modal>

            {/* Existing Modals for Add/Edit and other operations remain the same */}
            <Modal
                title={editingBook ? "Edit Diploma Book" : "Add New Diploma Book"}
                visible={isModalVisible}
                footer={null}
                onCancel={() => {
                    setIsModalVisible(false);
                    setEditingBook(null);
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSaveBook}
                >
                    <Form.Item
                        name="year"
                        label="Year"
                        rules={[{ required: true, message: 'Please select the year' }]}
                    >
                        <DatePicker 
                            picker="year" 
                            style={{ width: '100%' }} 
                            placeholder="Select Year"
                        />
                    </Form.Item>

                    <Form.Item
                        name="startDate"
                        label="Start Date"
                        rules={[{ required: true, message: 'Please select start date' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Select Start Date"
                        />
                    </Form.Item>

                    <Form.Item
                        name="endDate"
                        label="End Date"
                        rules={[{ required: true, message: 'Please select end date' }]}
                    >
                        <DatePicker 
                            style={{ width: '100%' }} 
                            placeholder="Select End Date"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            {editingBook ? 'Update' : 'Add'} Diploma Book
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default DiplomaBookManagement;