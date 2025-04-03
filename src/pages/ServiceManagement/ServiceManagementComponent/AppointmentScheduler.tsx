import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Form, Select, DatePicker, TimePicker, Button, message, Card, List, Tag, Modal, Popconfirm } from 'antd';
import moment from 'moment';

const AppointmentScheduler: React.FC = () => {
  // Use the appointment model
  const { 
    users, employees, services, appointments, reviews,
    addAppointment, updateAppointment, deleteAppointment,
    checkAppointmentConflict, getEmployeesByService, canEmployeeProvideService
  } = useModel('ServiceManagement.appointment');

  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<moment.Moment | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [availableEmployees, setAvailableEmployees] = useState<DichVu.NhanVien[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAppointment, setEditingAppointment] = useState<DichVu.LichHen | null>(null);

  // Filter available employees based on selected date and service
  // In AppointmentScheduler.tsx - Update the useEffect for filtering available employees

useEffect(() => {
  if (selectedDate && selectedService) {
    const dayOfWeek = selectedDate.format('dddd').toLowerCase();
    const dateStr = selectedDate.format('YYYY-MM-DD');
    
    // Get all employees who can provide this service
    const serviceProviders = getEmployeesByService(selectedService);
    
    // Debug output to help identify issues
    console.log('Selected day:', dayOfWeek);
    console.log('Service providers for service:', selectedService, serviceProviders);
    
    const available = serviceProviders.filter(employee => {
      // Check if employee has work schedule for the selected day
      const hasWorkSchedule = employee.lichLamViec && 
                             Array.isArray(employee.lichLamViec[dayOfWeek]) && 
                             employee.lichLamViec[dayOfWeek].length > 0;
      
      // Debug output
      console.log(`Employee ${employee.name} has work schedule:`, 
                 hasWorkSchedule, employee.lichLamViec?.[dayOfWeek]);
      
      if (!hasWorkSchedule) {
        return false;
      }
      
      // Check if employee has not reached their maximum daily appointments
      if (employee.sokhach) {
        const dailyAppointments = appointments.filter(
          app => app.employee_id === employee.employee_id && 
                 app.date === dateStr
        );
        
        // Debug output
        console.log(`Employee ${employee.name} daily appointments:`, 
                   dailyAppointments.length, 'max:', employee.sokhach);
        
        if (dailyAppointments.length >= employee.sokhach) {
          return false;
        }
      }
      
      return true;
    });
    
    console.log('Available employees after filtering:', available);
    setAvailableEmployees(available);
    
    // If no available employees are found but we have service providers,
    // check if we need to add work schedules
    if (available.length === 0 && serviceProviders.length > 0) {
      // Here you could implement a notification or auto-fix
      console.warn('Service providers exist but none are available. Check work schedules and capacity.');
    }
  } else {
    setAvailableEmployees([]);
  }
}, [selectedDate, selectedService, employees, appointments, services, getEmployeesByService]);


// or to a setup script that runs when your app initializes

const initializeSampleData = () => {
  // Check if employees exist
  if (employees.length === 0) {
    console.log("Initializing sample employee data...");
    
    // Add a sample employee
    const sampleEmployee = {
      employee_id: Date.now(),
      name: "Sample Provider",
      age: 30,
      sokhach: 10, // Can handle 10 appointments per day
      lichLamViec: {
        monday: [{ start: "09:00", end: "17:00" }],
        tuesday: [{ start: "09:00", end: "17:00" }],
        wednesday: [{ start: "09:00", end: "17:00" }],
        thursday: [{ start: "09:00", end: "17:00" }],
        friday: [{ start: "09:00", end: "17:00" }],
        saturday: [{ start: "10:00", end: "15:00" }]
      },
      dichvu_id: services.map(s => s.dichvu_id), // Can provide all services
      services: services.map(s => s.dichvu_id)
    };
    
    addEmployee(sampleEmployee);
  }
  
  // Check if any employees have services
  const employeesWithoutServices = employees.filter(
    emp => !emp.services || emp.services.length === 0
  );
  
  if (employeesWithoutServices.length > 0) {
    console.log("Updating employees with missing services...");
    
    employeesWithoutServices.forEach(emp => {
      // Update to provide all services
      const updatedEmployee = {
        ...emp,
        dichvu_id: services.map(s => s.dichvu_id),
        services: services.map(s => s.dichvu_id)
      };
      
      updateEmployee(updatedEmployee);
    });
  }
  
  // Check if employees have work schedules
  employees.forEach(emp => {
    if (!emp.lichLamViec || Object.keys(emp.lichLamViec).length === 0) {
      console.log(`Adding work schedule for ${emp.name}...`);
      
      const updatedEmployee = {
        ...emp,
        lichLamViec: {
          monday: [{ start: "09:00", end: "17:00" }],
          tuesday: [{ start: "09:00", end: "17:00" }],
          wednesday: [{ start: "09:00", end: "17:00" }],
          thursday: [{ start: "09:00", end: "17:00" }],
          friday: [{ start: "09:00", end: "17:00" }]
        }
      };
      
      updateEmployee(updatedEmployee);
    }
  });
};

// Call this in useEffect with an empty dependency array to run once on component mount
useEffect(() => {
  initializeSampleData();
}, []);

  // Handle form submission
  const handleSubmit = (values: any) => {
    console.log('Form values:', values);

    const date = values.date.format('YYYY-MM-DD');
    const time = values.time.format('HH:mm');
    const service = services.find(s => s.dichvu_id === values.dichvu_id);
    const duration = service?.thoiGianThucHien || 60;
    console.log('Service duration:', duration);

    // Check for scheduling conflicts
    const hasConflict = checkAppointmentConflict(
      values.employee_id,
      date,
      time,
      duration,
      editingAppointment?.lichhen_id
    );
    console.log('Has conflict:', hasConflict);

    if (hasConflict) {
      message.error('There is a scheduling conflict. Please select a different time.');
      return;
    }

    // Check if employee can provide the service
    const canProvideService = canEmployeeProvideService(values.employee_id, values.dichvu_id);
    console.log('Can provide service:', canProvideService);

    if (!canProvideService) {
      message.error('This employee cannot provide the selected service.');
      return;
    }

    // Check if appointment time is within employee's working hours
    const employee = employees.find(e => e.employee_id === values.employee_id);
    console.log('Selected employee:', employee);

    if (employee && employee.lichLamViec) {
      const dayOfWeek = moment(date).format('dddd').toLowerCase();
      const workTimeSlots = employee.lichLamViec[dayOfWeek];
      console.log('Day of week:', dayOfWeek, 'Work time slots:', workTimeSlots);

      if (Array.isArray(workTimeSlots) && workTimeSlots.length > 0) {
        const appointmentStart = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm');
        const appointmentEnd = moment(appointmentStart).add(duration, 'minutes');
        
        // Check if appointment fits within any of the employee's work time slots
        const isWithinWorkHours = workTimeSlots.some(slot => {
          const workStart = moment(`${date} ${slot.start}`, 'YYYY-MM-DD HH:mm');
          const workEnd = moment(`${date} ${slot.end}`, 'YYYY-MM-DD HH:mm');
          
          console.log('Checking time slot:', slot);
          console.log('Work start:', workStart.format('YYYY-MM-DD HH:mm'));
          console.log('Work end:', workEnd.format('YYYY-MM-DD HH:mm'));
          console.log('Appointment start:', appointmentStart.format('YYYY-MM-DD HH:mm'));
          console.log('Appointment end:', appointmentEnd.format('YYYY-MM-DD HH:mm'));
          
          return appointmentStart >= workStart && appointmentEnd <= workEnd;
        });
        
        if (!isWithinWorkHours) {
          message.error('The selected time is outside of the employee\'s working hours.');
          return;
        }
      } else {
        message.error('The employee does not work on this day.');
        return;
      }
    } else {
      message.error('Employee or work schedule not found.');
      return;
    }

    // Create or update appointment
    const appointmentData: DichVu.LichHen = {
      lichhen_id: editingAppointment ? editingAppointment.lichhen_id : Date.now(),
      date,
      time,
      dichvu_id: values.dichvu_id,
      employee_id: values.employee_id,
      user_id: values.user_id,
      status: editingAppointment ? editingAppointment.status : 'pending'
    };

    try {
      if (editingAppointment) {
        updateAppointment(appointmentData);
        message.success('Appointment updated successfully');
      } else {
        addAppointment(appointmentData);
        message.success('Appointment booked successfully');
      }

      setIsModalVisible(false);
      setEditingAppointment(null);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save appointment');
      console.error(error);
    }
  };

  // Handle date change
  const handleDateChange = (date: moment.Moment | null) => {
    setSelectedDate(date);
    form.setFieldsValue({ employee_id: undefined }); // Reset employee selection
  };

  // Handle service change
  const handleServiceChange = (serviceId: number) => {
    setSelectedService(serviceId);
    form.setFieldsValue({ employee_id: undefined }); // Reset employee selection
  };

  // Handle appointment edit
  const handleEdit = (appointment: DichVu.LichHen) => {
    setEditingAppointment(appointment);
    const service = services.find(s => s.dichvu_id === appointment.dichvu_id);
    setSelectedService(service?.dichvu_id || null);
    setSelectedDate(moment(appointment.date));
    
    form.setFieldsValue({
      user_id: appointment.user_id,
      dichvu_id: appointment.dichvu_id,
      date: moment(appointment.date),
      time: moment(appointment.time, 'HH:mm'),
      employee_id: appointment.employee_id,
    });
    
    setIsModalVisible(true);
  };

  // Handle appointment status change
  const handleStatusChange = (appointment: DichVu.LichHen, status: string) => {
    const updatedAppointment = { ...appointment, status };
    updateAppointment(updatedAppointment);
    message.success(`Appointment marked as ${status}`);
  };

  // Handle appointment deletion
  const handleDelete = (appointmentId: number) => {
    deleteAppointment(appointmentId);
    message.success('Appointment deleted successfully');
  };

  // Get status tag color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'gold';
      case 'confirmed': return 'blue';
      case 'completed': return 'green';
      case 'canceled': return 'red';
      default: return 'default';
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Appointment Scheduler</h1>
      
      <Button 
        type="primary" 
        onClick={() => {
          setEditingAppointment(null);
          form.resetFields();
          setIsModalVisible(true);
        }} 
        style={{ marginBottom: 16 }}
      >
        Book New Appointment
      </Button>
      
      <Card title="Current Appointments" style={{ marginBottom: 16 }}>
        <List
          itemLayout="horizontal"
          dataSource={appointments}
          renderItem={item => {
            const service = services.find(s => s.dichvu_id === item.dichvu_id);
            const employee = employees.find(e => e.employee_id === item.employee_id);
            const user = users.find(u => u.user_id === item.user_id);
            
            return (
              <List.Item
                actions={[
                  <Button type="link" onClick={() => handleEdit(item)}>Edit</Button>,
                  <Popconfirm
                    title="Are you sure you want to delete this appointment?"
                    onConfirm={() => handleDelete(item.lichhen_id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="link" danger>Delete</Button>
                  </Popconfirm>,
                  item.status !== 'confirmed' && item.status !== 'canceled' && (
                    <Button type="link" onClick={() => handleStatusChange(item, 'confirmed')}>
                      Confirm
                    </Button>
                  ),
                  item.status !== 'completed' && item.status !== 'canceled' && (
                    <Button type="link" onClick={() => handleStatusChange(item, 'completed')}>
                      Complete
                    </Button>
                  ),
                  item.status !== 'canceled' && (
                    <Button type="link" danger onClick={() => handleStatusChange(item, 'canceled')}>
                      Cancel
                    </Button>
                  )
                ]}
              >
                <List.Item.Meta
                  title={`${user?.name || 'Unknown User'} - ${service?.name || 'Unknown Service'}`}
                  description={
                    <>
                      <div>Date: {item.date} at {item.time}</div>
                      <div>Employee: {employee?.name || 'Unknown'}</div>
                      <div>
                        Status: <Tag color={getStatusColor(item.status || 'pending')}>{item.status || 'pending'}</Tag>
                      </div>
                    </>
                  }
                />
              </List.Item>
            );
          }}
        />
      </Card>

      <Modal
        title={editingAppointment ? "Edit Appointment" : "Book New Appointment"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingAppointment(null);
        }}
        footer={null}
      >
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleSubmit}
        >
          <Form.Item 
            name="user_id" 
            label="Customer" 
            rules={[{ required: true, message: 'Please select a customer' }]}
          >
            <Select placeholder="Select customer">
              {users.map(user => (
                <Select.Option key={user.user_id} value={user.user_id}>
                  {user.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="dichvu_id" 
            label="Service" 
            rules={[{ required: true, message: 'Please select a service' }]}
          >
            <Select 
              placeholder="Select service"
              onChange={handleServiceChange}
            >
              {services.map(service => (
                <Select.Option key={service.dichvu_id} value={service.dichvu_id}>
                  {service.name} - ${service.price} ({service.thoiGianThucHien || 60} minutes)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item 
            name="date" 
            label="Date" 
            rules={[{ required: true, message: 'Please select a date' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              onChange={handleDateChange}
              disabledDate={(current) => {
                return current && current < moment().startOf('day');
              }}
            />
          </Form.Item>

          <Form.Item 
            name="time" 
            label="Time" 
            rules={[{ required: true, message: 'Please select a time' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item 
            name="employee_id" 
            label="Service Provider" 
            rules={[{ required: true, message: 'Please select a service provider' }]}
          >
            <Select 
              placeholder="Select service provider"
              disabled={!selectedDate || !selectedService}
            >
              {availableEmployees.map(employee => {
                const employeeReviews = reviews.filter(r => r.employee_id === employee.employee_id);
                const totalRating = employeeReviews.reduce((sum, review) => sum + review.rating, 0);
                const avgRating = employeeReviews.length > 0 ? (totalRating / employeeReviews.length).toFixed(1) : null;
                
                return (
                  <Select.Option key={employee.employee_id} value={employee.employee_id}>
                    {employee.name} {avgRating ? `(Rating: ${avgRating}/5)` : ''}
                  </Select.Option>
                );
              })}
            </Select>
            {availableEmployees.length === 0 && selectedDate && selectedService && (
              <div style={{ color: '#ff4d4f', marginTop: 8 }}>
                No service providers available for this service on the selected date.
              </div>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAppointment ? 'Update Appointment' : 'Book Appointment'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentScheduler;