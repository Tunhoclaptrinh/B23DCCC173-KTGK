import { useState, useCallback, useEffect } from 'react';
import { Button, Modal, Table, Checkbox, Card, Switch } from 'antd';
import TaskForm from '../../components/Form/form4todolist';

const TodoList = () => {
    const [tasks, setTasks] = useState<TodoList.TodoListRecord[]>([]);
    const [visible, setVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentTask, setCurrentTask] = useState<TodoList.TodoListRecord | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [viewMode, setViewMode] = useState<'table' | 'card'>('table'); // State để chọn chế độ hiển thị

    // Fetch tasks from localStorage on initial load
    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        if (tasks.length) {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
    }, [tasks]);

    const handleAdd = useCallback(() => {
        setVisible(true);
        setIsEdit(false);
        setCurrentTask(null);
    }, []);

    const handleEdit = useCallback((task: TodoList.TodoListRecord) => {
        setCurrentTask(task);
        setIsEdit(true);
        setVisible(true);
    }, []);
    
    const handleDelete = useCallback((taskToDelete: TodoList.TodoListRecord) => {
        Modal.confirm({
            title: 'Are you sure?',
            content: `Delete "${taskToDelete.TaskName}"?`,
            onOk: () => {
                setTasks(prevTasks => prevTasks.filter(task => task.TaskName !== taskToDelete.TaskName));
            }
        });
    }, []);

    const handleFinish = useCallback((values: any) => {
        const newTask: TodoList.TodoListRecord = {
            TaskName: values.TaskName,
            DueDate: values.DueDate,
            Status: values.Status || false,
        };

        setTasks(prevTasks => {
            if (isEdit && currentTask) {
                return prevTasks.map(task =>
                    task.TaskName === currentTask.TaskName ? newTask : task
                );
            }
            return [...prevTasks, newTask];
        });
        
        setCurrentTask(null);
        setVisible(false);
    }, [isEdit, currentTask]);

    const toggleComplete = useCallback((taskToToggle: TodoList.TodoListRecord) => {
        setTasks(prevTasks => 
            prevTasks.map(task => 
                task.TaskName === taskToToggle.TaskName ? { ...task, Status: !task.Status } : task
            )
        );
    }, []);

    const columns = [
        {
            title: 'Task Name',
            dataIndex: 'TaskName',
            key: 'TaskName',
            render: (text: string, record: TodoList.TodoListRecord) => (
                <span style={{ fontWeight: 'bold', textDecoration: record.Status ? 'line-through' : 'none' }}>
                    {text}
                </span>
            ),
        },
        {
            title: 'Due Date',
            dataIndex: 'DueDate',
            key: 'DueDate',
            align: 'center',
            width: 200,
            render: (date: string) => (
                <span style={{ fontWeight: 'bold' }}>
                    {date}
                </span>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'Status',
            key: 'Status',
            align: 'center',
            width: 200,
            render: (_: any, record: TodoList.TodoListRecord) => (
                <Checkbox checked={record.Status} onChange={() => toggleComplete(record)}>
                    {record.Status ? 'Completed' : 'Pending'}
                </Checkbox>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            width: 200,
            render: (_: any, record: TodoList.TodoListRecord) => (
                <div>
                    <Button onClick={() => handleEdit(record)}>Edit</Button>
                    <Button onClick={() => handleDelete(record)} danger style={{ marginLeft: 10 , backgroundColor: "red", color: "white"}}>Delete</Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ width: '100%', padding: '20px'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button type="primary" onClick={handleAdd}>Add Task</Button>
                <Switch 
                    checkedChildren="Card View" 
                    unCheckedChildren="Table View" 
                    checked={viewMode === 'card'} 
                    onChange={() => setViewMode(prev => prev === 'table' ? 'card' : 'table')} 
                />
            </div>

            {viewMode === 'table' ? (
                <Table
                    dataSource={tasks}
                    columns={columns}
                    rowKey="TaskName"
                    pagination={{
                        current: page,
                        pageSize: pageSize,
                        onChange: (page, pageSize) => {
                            setPage(page);
                            setPageSize(pageSize);
                        },
                        showSizeChanger: true,
                        pageSizeOptions: ['5', '10', '20', '50'],
                    }}
                    scroll={{ x: 'max-content' }}
                    style={{ marginTop: '20px' }}
                />
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '20px', justifyContent: 'center' }}>
                    {tasks.map((task) => (
                        <Card 
                            key={task.TaskName} 
                            title={<span style={{ textDecoration: task.Status ? 'line-through' : 'none' }}>{task.TaskName}</span>} 
                            style={{ width: 300, border: task.Status ? '2px solid green' : '1px solid red' }}
                            actions={[
                                <Button onClick={() => handleEdit(task)}>Edit</Button>,
                                <Button onClick={() => handleDelete(task)} danger style={{ backgroundColor: 'red', color: 'white' }}>Delete</Button>
                            ]}
                        >
                            <p><strong>Due Date:</strong> {task.DueDate}</p>
                            <Checkbox checked={task.Status} onChange={() => toggleComplete(task)}>
                                {task.Status ? 'Completed' : 'Pending'}
                            </Checkbox>
                        </Card>
                    ))}
                </div>
            )}

            <Modal
                title={isEdit ? 'Edit Task' : 'Add Task'}
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}
            >
                <TaskForm
                    key={currentTask?.TaskName || 'new'} 
                    initialValues={{
                        TaskName: currentTask?.TaskName || '',
                        DueDate: currentTask?.DueDate || '',
                        Status: currentTask?.Status || false,
                    }}
                    isEdit={isEdit}
                    onFinish={handleFinish}
                    onCancel={() => setVisible(false)}
                />
            </Modal>
        </div>
    );
};

export default TodoList;
