import React from 'react';
import { Modal, Table } from 'antd';

const DiplomasViewModal = ({ 
  isDiplomasModalVisible, 
  setIsDiplomasModalVisible, 
  selectedBookDiplomas 
}) => {
  const diplomasColumns = [
    { title: 'Diploma Serial Number', dataIndex: 'diplomaSerialNumber', key: 'diplomaSerialNumber' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Student ID', dataIndex: 'studentId', key: 'studentId' },
    { title: 'Date of Birth', dataIndex: 'dateOfBirth', key: 'dateOfBirth' },
    { title: 'Book Entry Number', dataIndex: 'bookEntryNumber', key: 'bookEntryNumber' }
  ];

  return (
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
        locale={{ emptyText: 'No diplomas found in this book' }}
      />
    </Modal>
  );
};

export default DiplomasViewModal;