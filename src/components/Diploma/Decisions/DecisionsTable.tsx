import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import moment from 'moment';

const DecisionTable: React.FC<{
  graduationDecisions: any[];
  diplomaBooks: any[];
  onDelete: (decisionId: string) => void;
}> = ({ graduationDecisions, diplomaBooks, onDelete }) => {
  const columns = [
    {
      title: 'Graduation Decision Title',
      key: 'graduationDecisionTitle',
      render: (_, record) => {
        const formattedDate = moment(record.issuanceDate).format('YYYY-MM-DD');
        return <strong>{`${record.decisionNumber} - ${formattedDate}`}</strong>;
      },
    },
    { title: 'Decision Number', dataIndex: 'decisionNumber', key: 'decisionNumber' },
    { title: 'Issuance Date', dataIndex: 'issuanceDate', key: 'issuanceDate' },
    { title: 'Summary', dataIndex: 'summary', key: 'summary' },
    {
      title: 'Diploma Book',
      dataIndex: 'diplomaBookId',
      key: 'diplomaBookId',
      render: (bookId) => {
        const book = diplomaBooks.find(b => b.id === bookId);
        return book ? `${book.year} Book` : bookId;
      }
    },
    { title: 'Total Lookups', dataIndex: 'totalLookups', key: 'totalLookups' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure you want to delete this graduation decision?"
          onConfirm={() => onDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    }
  ];

  return <Table columns={columns} dataSource={graduationDecisions} rowKey="id" />;
};

export default DecisionTable;