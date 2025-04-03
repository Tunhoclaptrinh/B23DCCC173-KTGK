import type { IColumn } from '@/components/Table/typing';
import { Button, Form, Input, Modal, Table } from 'antd';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import UserForm from '../../components/Form4RandomUser/form';


const RandomUser = () => {
	const { data, getDataUser } = useModel('randomuser');
	const [visible, setVisible] = useState<boolean>(false);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [row, setRow] = useState<RandomUser.Record>();

	useEffect(() => {
		getDataUser();
	}, []);

	// Lấy URL hiện tại
	const urlParams = new URLSearchParams(window.location.search);

	// Lấy giá trị của tham số "param1"
	const color1 = urlParams.get('color1');
	const color2 = urlParams.get('color2');

	const columns: IColumn<RandomUser.Record>[] = [
		{
			title: 'First Name',
			dataIndex: 'first',
			key: 'name',
			width: 200,
		},
		{
			title: 'Last Name',
			dataIndex: 'last',
			key: 'name',
			width: 200,
		},
		{
			title: 'email',
			dataIndex: 'email',
			key: 'name',
			width: 200,
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'name',
			width: 200,
		},
		{
			title: 'Created',
			dataIndex: 'created',
			key: 'name',
			width: 200,
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			key: 'age',
			width: 100,
		},
		{
			title: 'Action',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Edit
						</Button>
						<Button
							style={{ marginLeft: 10 }}
							onClick={() => {
								const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
								const newData = dataLocal.filter((item: any) => item.address !== record.address);
								localStorage.setItem('data', JSON.stringify(newData));
								getDataUser();
							}}
							type='primary'
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<Button
				type='primary'
				onClick={() => {
					setVisible(true);
					setIsEdit(false);
				}}
				style={{ backgroundColor: color1, color: color2 }}
			>
				Add User
			</Button>
			<Table dataSource={data} columns={columns} />
			<UserForm
				visible={visible}
				setVisible={setVisible}
				isEdit={isEdit}
				row={row}
				data={data}
				getDataUser={getDataUser}
			/>
		</div>
	);
};

export default RandomUser;
