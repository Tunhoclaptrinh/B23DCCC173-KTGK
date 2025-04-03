import React from 'react';
import { Form, Card, Checkbox, TimePicker } from 'antd';

interface EmployeeScheduleFormProps {
  form: any;
}

const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

const EmployeeScheduleForm: React.FC<EmployeeScheduleFormProps> = ({ 
  form 
}) => {
  return (
    <Form form={form} layout="vertical">
      {weekDays.map((day) => (
        <Card
          key={day}
          title={day.charAt(0).toUpperCase() + day.slice(1)}
          size="small"
          style={{ marginBottom: 10 }}
        >
          <Form.Item name={`${day}_enabled`} valuePropName="checked">
            <Checkbox>Working day</Checkbox>
          </Form.Item>

          <Form.Item noStyle shouldUpdate>
            {({ getFieldValue }) => {
              const isEnabled = getFieldValue(`${day}_enabled`);
              return (
                <div style={{ display: 'flex', gap: 10 }}>
                  <Form.Item
                    name={`${day}_start`}
                    label="Start time"
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} disabled={!isEnabled} />
                  </Form.Item>

                  <Form.Item
                    name={`${day}_end`}
                    label="End time"
                    style={{ marginBottom: 0, flex: 1 }}
                  >
                    <TimePicker format="HH:mm" style={{ width: '100%' }} disabled={!isEnabled} />
                  </Form.Item>
                </div>
              );
            }}
          </Form.Item>
        </Card>
      ))}
    </Form>
  );
};

export default EmployeeScheduleForm;