import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, message } from 'antd';
import { useModel } from 'umi';
import AddEditDiplomaModal from '@/components/Diploma/Information/AddandEditDiploma';
import SearchDiplomaModal from '@/components/Diploma/Information/SearchDiplomaModal';
import DiplomaDetailsModal from '@/components/Diploma/DiplomaDetailsModal';

const DiplomaInformationManagement: React.FC = () => {
    const { 
        diplomaInformations, 
        addDiplomaInformation,
        updateDiplomaInformation,
        deleteDiplomaInformation,
        exportDiplomaData,
        importDiplomaData,
        diplomaBooks,
        advancedDiplomaSearch
    } = useModel('DiplomaManagement.diploma-model');
    
    const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [selectedDiplomaDetails, setSelectedDiplomaDetails] = useState<any>(null);
    const [editingDiploma, setEditingDiploma] = useState<any>(null);
    
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        setTableData(diplomaInformations);
    }, [diplomaInformations]);

    const handleSaveDiplomaInformation = (diplomaInfoData: any) => {
        if (editingDiploma) {
            updateDiplomaInformation(diplomaInfoData);
            message.success('Diploma Information Updated Successfully');
        } else {
            addDiplomaInformation(diplomaInfoData);
            message.success('Diploma Information Added Successfully');
        }

        setIsAddEditModalVisible(false);
        setEditingDiploma(null);
    };

    const handleEdit = (diploma: any) => {
        setEditingDiploma(diploma);
        setIsAddEditModalVisible(true);
    };

    const handleDelete = (diplomaId: string) => {
        deleteDiplomaInformation(diplomaId);
        message.success('Diploma Information Deleted Successfully');
    };

    const handleSearch = (searchCriteria: any) => {
        const results = advancedDiplomaSearch(searchCriteria);
        setTableData(results);
        setIsSearchModalVisible(false);
        message.success(`Found ${results.length} diploma(s)`);
    };

    const handleExport = () => {
        const data = exportDiplomaData();
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'diploma_information_export.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        message.success('Diploma Information Exported Successfully');
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target?.result as string);
                importDiplomaData(jsonData);
                message.success('Diploma Information Imported Successfully');
            } catch (error) {
                message.error('Failed to import diploma information');
            }
        };
        
        if (event.target.files && event.target.files.length > 0) {
            fileReader.readAsText(event.target.files[0]);
        }
    };

    

    const columns = [
        { title: 'Diploma Serial Number', dataIndex: 'diplomaSerialNumber', key: 'diplomaSerialNumber' },
        { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
        { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
        { title: 'Date of Birth', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
        {
            title: 'Diploma Book',
            dataIndex: 'diplomaBookId',
            key: 'diplomaBookId',
            render: (bookId) => {
                const book = diplomaBooks.find(b => b.id === bookId);
                return book ? `${book.year} Book` : bookId;
            }
        },
        { title: 'Book Entry Number', dataIndex: 'bookEntryNumber', key: 'bookEntryNumber' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <>
                    <Button onClick={() => setSelectedDiplomaDetails(record)}>View Details</Button>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <Button 
                        type="primary" 
                        onClick={() => setIsAddEditModalVisible(true)}
                    >
                        Add Diploma Information
                    </Button>
                    <Button 
                        onClick={() => setIsSearchModalVisible(true)}
                    >
                        Search Diplomas
                    </Button>
                    <Button onClick={handleExport}>
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
                        <Button component="span">
                            Import Data
                        </Button>
                    </label>
                </div>
            </div>


            <Table columns={columns} dataSource={tableData} rowKey="id" />

            {isAddEditModalVisible && (
                <AddEditDiplomaModal
                    visible={isAddEditModalVisible}
                    onCancel={() => {
                        setIsAddEditModalVisible(false);
                        setEditingDiploma(null);
                    }}
                    onSave={handleSaveDiplomaInformation}
                    editingDiploma={editingDiploma}
                />
            )}

            {isSearchModalVisible && (
                <SearchDiplomaModal
                    visible={isSearchModalVisible}
                    onCancel={() => setIsSearchModalVisible(false)}
                    onSearch={handleSearch}
                />
            )}

            {selectedDiplomaDetails && (
                <DiplomaDetailsModal 
                    diploma={selectedDiplomaDetails}
                    onClose={() => setSelectedDiplomaDetails(null)}
                />
            )}
        </div>
    );
};

export default DiplomaInformationManagement;

