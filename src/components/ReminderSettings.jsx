import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Switch, 
  Select, 
  TimePicker, 
  List, 
  Button, 
  Space, 
  Tag, 
  message,
  Badge,
  Modal
} from 'antd';
import { 
  BellOutlined, 
  ClockCircleOutlined, 
  DeleteOutlined,
  CheckOutlined,
  SoundOutlined,
  NotificationOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const ReminderSettings = ({ tasks, onUpdateTask, isDarkMode, isMobile }) => {
  const [reminders, setReminders] = useState([]);
  const [defaultReminderTime, setDefaultReminderTime] = useState(moment('09:00', 'HH:mm'));
  const [notificationSound, setNotificationSound] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Collect all tasks with reminders
  useEffect(() => {
    const tasksWithReminders = tasks.filter(task => task.reminder);
    setReminders(tasksWithReminders);
  }, [tasks]);

  // Check for upcoming reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = moment();
      reminders.forEach(reminder => {
        const reminderTime = moment(reminder.reminder);
        const diff = reminderTime.diff(now, 'minutes');
        
        if (diff >= 0 && diff <= 5 && !reminder.notified) {
          // Show notification
          if (notificationSound) {
            playNotificationSound();
          }
          
          message.warning({
            content: `⏰ Reminder: ${reminder.value}`,
            duration: 10,
            icon: <BellOutlined />
          });

          // Mark as notified
          onUpdateTask(reminder.id, { ...reminder, notified: true });
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, notificationSound]);

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  // Group reminders by date
  const groupedReminders = reminders.reduce((groups, reminder) => {
    const date = moment(reminder.reminder).format('YYYY-MM-DD');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reminder);
    return groups;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedReminders).sort();

  // Quick reminder presets
  const reminderPresets = [
    { label: '5 minutes before', value: 5 },
    { label: '15 minutes before', value: 15 },
    { label: '30 minutes before', value: 30 },
    { label: '1 hour before', value: 60 },
    { label: '2 hours before', value: 120 },
    { label: '1 day before', value: 1440 }
  ];

  const setQuickReminder = (task, minutesBefore) => {
    const dueTime = moment(task.dueDate);
    const reminderTime = dueTime.clone().subtract(minutesBefore, 'minutes');
    
    onUpdateTask(task.id, {
      ...task,
      reminder: reminderTime.toISOString()
    });
    
    message.success(`Reminder set for ${reminderTime.format('MMM DD, h:mm A')}`);
  };

  return (
    <Card 
      title={
        <Space>
          <BellOutlined style={{ color: '#1890ff' }} />
          <span>Reminders & Notifications</span>
          <Badge count={reminders.length} style={{ background: '#52c41a' }} />
        </Space>
      }
      style={{ 
        marginBottom: 24,
        background: isDarkMode ? '#1f1f1f' : '#fff',
        borderRadius: '12px'
      }}
      bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
    >
      {/* Settings */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
        padding: '12px',
        background: isDarkMode ? '#2d2d2d' : '#f8f9fa',
        borderRadius: '8px'
      }}>
        <Space size={isMobile ? 8 : 16} wrap>
          <Space>
            <SoundOutlined />
            <span>Notification Sound</span>
            <Switch 
              checked={notificationSound}
              onChange={setNotificationSound}
              size={isMobile ? 'small' : 'default'}
            />
          </Space>

          <Space>
            <ClockCircleOutlined />
            <span>Default Reminder</span>
            <TimePicker
              value={defaultReminderTime}
              onChange={setDefaultReminderTime}
              format="h:mm A"
              size={isMobile ? 'small' : 'middle'}
              style={{ width: isMobile ? '100px' : '120px' }}
            />
          </Space>
        </Space>

        <Button 
          type="primary"
          icon={<NotificationOutlined />}
          size={isMobile ? 'small' : 'middle'}
          onClick={() => {
            if (Notification.permission === 'default') {
              Notification.requestPermission();
            }
          }}
        >
          Test Notification
        </Button>
      </div>

      {/* Upcoming Reminders */}
      <h4 style={{ 
        color: isDarkMode ? '#fff' : '#333',
        marginBottom: '12px'
      }}>
        Upcoming Reminders
      </h4>

      {reminders.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px 20px',
          color: '#999'
        }}>
          <BellOutlined style={{ fontSize: 48, marginBottom: 16 }} />
          <p>No reminders set</p>
          <p style={{ fontSize: '12px' }}>
            Set reminders for your tasks to get notified
          </p>
        </div>
      ) : (
        <List
          dataSource={sortedDates}
          renderItem={date => (
            <div key={date} style={{ marginBottom: 16 }}>
              <h5 style={{ 
                color: isDarkMode ? '#ddd' : '#666',
                marginBottom: 8,
                paddingLeft: 8
              }}>
                {moment(date).format('dddd, MMMM DD, YYYY')}
              </h5>
              
              {groupedReminders[date].map(reminder => (
                <div
                  key={reminder.id}
                  style={{
                    padding: '12px',
                    background: isDarkMode ? '#2d2d2d' : '#f8f9fa',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}
                >
                  <Space direction="vertical" size={2}>
                    <Space>
                      <BellOutlined style={{ color: '#faad14' }} />
                      <span style={{ 
                        color: isDarkMode ? '#fff' : '#333',
                        fontWeight: '500'
                      }}>
                        {reminder.value}
                      </span>
                    </Space>
                    <Space size={4}>
                      <ClockCircleOutlined style={{ fontSize: '12px', color: '#999' }} />
                      <span style={{ fontSize: '12px', color: '#999' }}>
                        {moment(reminder.reminder).format('h:mm A')}
                      </span>
                      <Tag color={moment(reminder.reminder).isBefore(moment()) ? 'red' : 'green'} size="small">
                        {moment(reminder.reminder).fromNow()}
                      </Tag>
                    </Space>
                  </Space>

                  <Space size={4}>
                    <Select
                      placeholder="Quick set"
                      size="small"
                      style={{ width: isMobile ? '80px' : '100px' }}
                      onChange={(minutes) => setQuickReminder(reminder, minutes)}
                    >
                      {reminderPresets.map(preset => (
                        <Option key={preset.value} value={preset.value}>
                          {preset.label}
                        </Option>
                      ))}
                    </Select>

                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => {
                        onUpdateTask(reminder.id, { ...reminder, reminder: null });
                        message.info('Reminder removed');
                      }}
                    />
                  </Space>
                </div>
              ))}
            </div>
          )}
        />
      )}
    </Card>
  );
};

export default ReminderSettings;