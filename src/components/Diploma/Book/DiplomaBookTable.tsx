import React from 'react';
import { Table, Button, Popconfirm } from 'antd';

const DiplomaBookTable = ({ 
  diplomaBooks, 
  handleViewDiplomas, 
  handleEdit, 
  handleDelete 
}) => {
  const columns = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Start Date', dataIndex: 'startDate', key: 'startDate' },
    { title: 'End Date', dataIndex: 'endDate', key: 'endDate' },
    { 
      title: 'Current Entry Number', 
      dataIndex: 'currentEntryNumber', 
      key: 'currentEntryNumber' 
    },
    {
      title: 'Diplomas',
      key: 'diplomas',
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewDiplomas(record)}>
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

  return (
    <Table 
      columns={columns} 
      dataSource={diplomaBooks} 
      rowKey="id" 
    />
  );
};

export default DiplomaBookTable;