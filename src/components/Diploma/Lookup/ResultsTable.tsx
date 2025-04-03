import React from 'react';
import { Table, Button, Tag } from 'antd';

const ResultsTable: React.FC<{
  searchResults: any[];
  onViewDetails: (diploma: any) => void;
}> = ({ searchResults, onViewDetails }) => {
  const columns = [
    { 
      title: 'Diploma Serial Number', 
      dataIndex: 'diplomaSerialNumber', 
      key: 'diplomaSerialNumber' 
    },
    { 
      title: 'Book Entry Number', 
      dataIndex: 'bookEntryNumber', 
      key: 'bookEntryNumber' 
    },
    { 
      title: 'Full Name', 
      dataIndex: 'fullName', 
      key: 'fullName' 
    },
    {
      title: 'Diploma Lookups',
      dataIndex: 'diplomaLookups',
      key: 'diplomaLookups',
      render: (lookupCount: number) => (
        <Tag color={lookupCount > 0 ? 'blue' : 'default'}>
          {lookupCount} Lookup{lookupCount !== 1 ? 's' : ''}
        </Tag>
      )
    },
    {
      title: 'Graduation Decision Lookups',
      dataIndex: 'graduationDecisionLookups',
      key: 'graduationDecisionLookups',
      render: (lookupCount: number) => (
        <Tag color={lookupCount > 0 ? 'green' : 'default'}>
          {lookupCount} Lookup{lookupCount !== 1 ? 's' : ''}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button onClick={() => onViewDetails(record)}>
          View Details
        </Button>
      )
    }
  ];

  return (
    <Table 
      style={{ marginTop: 16 }}
      columns={columns} 
      dataSource={searchResults} 
      rowKey="id"
      locale={{
        emptyText: 'No diplomas found. Please modify your search criteria.'
      }}
    />
  );
};

export default ResultsTable;