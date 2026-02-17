import React from 'react';
import { Modal, Form, DatePicker, TimePicker, Select, Button, Space, message } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const ReminderModal = ({ visible, onCancel, task, onSetReminder }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const { reminderDate, reminderTime, reminderBefore } = values;
      
      let reminderDateTime;
      if (reminderBefore) {
        // Set reminder based on due date
        const dueDate = moment(task.dueDate);
        reminderDateTime = dueDate.clone().subtract(reminderBefore, 'minutes');
      } else {
        // Set custom reminder time
        reminderDateTime = moment(reminderDate)
          .set('hour', reminderTime.hour())
          .set('minute', reminderTime.minute())
          .set('second', 0);
      }

      onSetReminder(task.id, reminderDateTime.toISOString());
      message.success('Reminder set successfully!');
      onCancel();
    });
  };

  return (
    <Modal
      title={
        <Space>
          <BellOutlined style={{ color: '#1890ff' }} />
          Set Reminder
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Set Reminder
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          reminderType: 'custom'
        }}
      >
        <Form.Item
          name="reminderType"
          label="Reminder Type"
        >
          <Select>
            <Option value="custom">Custom Time</Option>
            <Option value="before">Before Due Date</Option>
          </Select>
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => 
            prevValues.reminderType !== currentValues.reminderType
          }
        >
          {({ getFieldValue }) => {
            const reminderType = getFieldValue('reminderType');

            if (reminderType === 'custom') {
              return (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Form.Item
                    name="reminderDate"
                    label="Date"
                    rules={[{ required: true, message: 'Please select date' }]}
                  >
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name="reminderTime"
                    label="Time"
                    rules={[{ required: true, message: 'Please select time' }]}
                  >
                    <TimePicker format="h:mm A" style={{ width: '100%' }} />
                  </Form.Item>
                </Space>
              );
            }

            return (
              <Form.Item
                name="reminderBefore"
                label="Remind me"
                rules={[{ required: true, message: 'Please select when to remind' }]}
              >
                <Select>
                  <Option value={5}>5 minutes before</Option>
                  <Option value={15}>15 minutes before</Option>
                  <Option value={30}>30 minutes before</Option>
                  <Option value={60}>1 hour before</Option>
                  <Option value={120}>2 hours before</Option>
                  <Option value={1440}>1 day before</Option>
                  <Option value={2880}>2 days before</Option>
                  <Option value={10080}>1 week before</Option>
                </Select>
              </Form.Item>
            );
          }}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ReminderModal;