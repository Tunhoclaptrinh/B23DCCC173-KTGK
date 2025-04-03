import React, { useState } from 'react';
import { useModel } from 'umi';
import { Button, Table, Space, Modal, Card, Popconfirm, message } from 'antd';
import CustomerForm from '../../../components/Form/CustomerForm'; // Import the new component

const CustomerManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useModel('ServiceManagement.appointment');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const showAddModal = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const showEditModal = (user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = (values) => {
    if (editingUser) {
      updateUser({ user_id: editingUser.user_id, ...values });
      message.success('Cập nhật khách hàng thành công!');
    } else {
      const newUser = { user_id: Date.now(), ...values };
      addUser(newUser);
      message.success('Thêm khách hàng mới thành công!');
    }
    setIsModalVisible(false);
  };

  const handleDelete = (user_id) => {
    deleteUser(user_id);
    message.success('Xóa khách hàng thành công!');
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tuổi',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => (gender === 'male' ? 'Nam' : 'Nữ'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => showEditModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.user_id)}>
            <Button type="danger">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Quản lý khách hàng">
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Thêm khách hàng
      </Button>
      <Table dataSource={users} columns={columns} rowKey="user_id" />
      <Modal
        title={editingUser ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <CustomerForm
          initialValues={editingUser}
          onFinish={handleFinish}
          onCancel={handleCancel}
        />
      </Modal>
    </Card>
  );
};

export default CustomerManagement;