import React, { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { Table, Button, Modal, Form, Input, Rate, message } from 'antd';

const AppointmentReviews = () => {
  const {
    appointments,
    reviews,
    addReview,
    updateReview,
    services,
    employees,
    users,
  } = useModel('ServiceManagement.appointment');
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isResponseModalVisible, setIsResponseModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<DichVu.LichHen | null>(null);
  const [selectedReview, setSelectedReview] = useState<DichVu.Review | null>(null);
  const [form] = Form.useForm();

  // Filter completed appointments that haven't been reviewed yet
  const completedAppointments = appointments.filter(
    (appointment) =>
      appointment.status === 'completed' &&
      !reviews.some((review) => review.review_id === appointment.review_id)
  );

  // Show review modal for a completed appointment
  const showReviewModal = (appointment: DichVu.LichHen) => {
    setSelectedAppointment(appointment);
    setIsReviewModalVisible(true);
    form.resetFields();
  };

  // Show response modal for an existing review
  const showResponseModal = (review: DichVu.Review) => {
    setSelectedReview(review);
    setIsResponseModalVisible(true);
    form.setFieldsValue({ response: review.response || '' });
  };

  // Submit a new review
  const handleReviewSubmit = (values: { rating: number; review: string }) => {
    if (!selectedAppointment) return;

    const newReview: DichVu.Review = {
      review_id: Date.now(), // Simple unique ID
      user_id: selectedAppointment.user_id,
      employee_id: selectedAppointment.employee_id,
      dichvu_id: selectedAppointment.dichvu_id,
      rating: values.rating,
      review: values.review,
      create_at: new Date().toISOString(),
    };

    addReview(newReview);
    message.success('Review submitted successfully!');
    setIsReviewModalVisible(false);

    // Update the appointment with the review ID
    const updatedAppointment = { ...selectedAppointment, review_id: newReview.review_id };
    updateAppointment(updatedAppointment);
  };

  // Submit a response to a review
  const handleResponseSubmit = (values: { response: string }) => {
    if (!selectedReview) return;

    const updatedReview: DichVu.Review = {
      ...selectedReview,
      response: values.response,
    };

    updateReview(updatedReview);
    message.success('Response submitted successfully!');
    setIsResponseModalVisible(false);
  };

  // Define columns for the completed appointments table
  const appointmentColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Service',
      dataIndex: 'dichvu_id',
      key: 'dichvu_id',
      render: (dichvu_id: number) => {
        const service = services.find((s) => s.dichvu_id === dichvu_id);
        return service?.name || 'Unknown Service';
      },
    },
    {
      title: 'Employee',
      dataIndex: 'employee_id',
      key: 'employee_id',
      render: (employee_id: number) => {
        const employee = employees.find((e) => e.employee_id === employee_id);
        return employee?.name || 'Unknown Employee';
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DichVu.LichHen) => (
        <Button onClick={() => showReviewModal(record)} disabled={!!record.review_id}>
          Review
        </Button>
      ),
    },
  ];

  // Define columns for the reviews table
  const reviewColumns = [
    {
      title: 'Service',
      dataIndex: 'dichvu_id',
      key: 'dichvu_id',
      render: (dichvu_id: number) => {
        const service = services.find((s) => s.dichvu_id === dichvu_id);
        return service?.name || 'Unknown Service';
      },
    },
    {
      title: 'Employee',
      dataIndex: 'employee_id',
      key: 'employee_id',
      render: (employee_id: number) => {
        const employee = employees.find((e) => e.employee_id === employee_id);
        return employee?.name || 'Unknown Employee';
      },
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => <Rate disabled defaultValue={rating} />,
    },
    {
      title: 'Review',
      dataIndex: 'review',
      key: 'review',
    },
    {
      title: 'Response',
      dataIndex: 'response',
      key: 'response',
      render: (response: string, record: DichVu.Review) =>
        response ? (
          response
        ) : (
          <Button onClick={() => showResponseModal(record)}>Respond</Button>
        ),
    },
  ];

  return (
    <div>
      <h2>Appointment Reviews</h2>

      {/* Table for completed appointments available for review */}
      <h3>Completed Appointments</h3>
      <Table
        dataSource={completedAppointments}
        columns={appointmentColumns}
        rowKey="lichhen_id"
        pagination={{ pageSize: 5 }}
      />

      {/* Table for existing reviews */}
      <h3>Existing Reviews</h3>
      <Table dataSource={reviews} columns={reviewColumns} rowKey="review_id" pagination={{ pageSize: 5 }} />

      {/* Review Modal */}
      <Modal
        title="Submit a Review"
        visible={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
          <Form.Item name="rating" label="Rating" rules={[{ required: true, message: 'Please provide a rating' }]}>
            <Rate />
          </Form.Item>
          <Form.Item name="review" label="Review" rules={[{ required: true, message: 'Please write a review' }]}>
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>

      {/* Response Modal */}
      <Modal
        title="Respond to Review"
        visible={isResponseModalVisible}
        onCancel={() => setIsResponseModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleResponseSubmit} layout="vertical">
          <Form.Item name="response" label="Response" rules={[{ required: true, message: 'Please write a response' }]}>
            <Input.TextArea />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default AppointmentReviews;