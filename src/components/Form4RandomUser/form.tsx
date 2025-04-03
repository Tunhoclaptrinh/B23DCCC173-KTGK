import type { IColumn } from '@/components/Table/typing';
import component from '@/locales/en-US/component';
import { Button, Form, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

interface UserFormProps {
	visible: boolean;
	setVisible: (visible: boolean) => void;
	isEdit: boolean;
	row: any;
	data: any[];
	getDataUser: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ visible, setVisible, isEdit, row, data, getDataUser }) => {
	return (
		// const UserForm = ({ visible, setVisible, isEdit, row, data, getDataUser }) => {
		//     return (
		<Modal
			destroyOnClose
			footer={false}
			title={isEdit ? 'Edit User' : 'Add User'}
			visible={visible}
			onOk={() => {}}
			onCancel={() => {
				setVisible(false);
			}}
		>
			<Form
				onFinish={(values) => {
					const index = data.findIndex((item: any) => item.address === row?.address);
					const dataTemp: RandomUser.Record[] = [...data];
					dataTemp.splice(index, 1, values);
					const dataLocal = isEdit ? dataTemp : [values, ...data];
					localStorage.setItem('data', JSON.stringify(dataLocal));
					setVisible(false);
					getDataUser();
				}}
			>
				<Form.Item
					initialValue={row?.first}
					label='First Name'
					name='first'
					rules={[{ required: true, message: 'Please input your First Name!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					initialValue={row?.last}
					label='Last Name'
					name='last'
					rules={[{ required: true, message: 'Please input your Last Name!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					initialValue={row?.email}
					label='email'
					name='email'
					rules={[{ required: true, message: 'Please input your email!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					initialValue={row?.address}
					label='address'
					name='address'
					rules={[{ required: true, message: 'Please input your address!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					initialValue={row?.created}
					label='created'
					name='created'
					rules={[{ required: true, message: 'Please input your created!' }]}
				>
					<Input />
				</Form.Item>
				<Form.Item
					initialValue={row?.balance}
					label='balance'
					name='balance'
					rules={[{ required: true, message: 'Please input your balance!' }]}
				>
					<Input />
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{isEdit ? 'Save' : 'Insert'}
					</Button>
					<Button onClick={() => setVisible(false)}>Cancel</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default UserForm;
