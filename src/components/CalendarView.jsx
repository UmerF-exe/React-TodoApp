import React, { useState } from 'react';
import { Calendar, Badge, Modal, List, Button, Space, Tag, message, TimePicker } from 'antd';
import { 
  CalendarOutlined, 
  ClockCircleOutlined, 
  BellOutlined,
  CheckCircleOutlined,
  CloseOutlined,
  PlusOutlined
} from '@ant-design/icons';
import moment from 'moment';

const CalendarView = ({ tasks, onUpdateTask, isDarkMode, isMobile }) => {
  const [selectedDate, setSelectedDate] = useState(moment());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [reminderTime, setReminderTime] = useState(null);

  // Get tasks for a specific date
  const getTasksByDate = (date) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = moment(task.dueDate).format('YYYY-MM-DD');
      const selectedDateStr = date.format('YYYY-MM-DD');
      return taskDate === selectedDateStr;
    });
  };

  // Date cell render function for calendar
  const dateCellRender = (date) => {
    const dayTasks = getTasksByDate(date);
    
    return (
      <div style={{ padding: '4px' }}>
        {dayTasks.slice(0, 3).map(task => (
          <Badge
            key={task.id}
            status={task.completed ? 'success' : 'processing'}
            text={
              <span style={{ 
                fontSize: isMobile ? '10px' : '12px',
                textDecoration: task.completed ? 'line-through' : 'none',
                opacity: task.completed ? 0.6 : 1
              }}>
                {task.value.length > (isMobile ? 10 : 15) 
                  ? task.value.substring(0, isMobile ? 10 : 15) + '...' 
                  : task.value}
              </span>
            }
            color={task.completed ? '#52c41a' : '#1890ff'}
            style={{ display: 'block', marginBottom: 2 }}
          />
        ))}
        {dayTasks.length > 3 && (
          <span style={{ fontSize: isMobile ? '10px' : '12px', color: '#999' }}>
            +{dayTasks.length - 3} more
          </span>
        )}
      </div>
    );
  };

  // Handle date selection
  const onSelectDate = (date) => {
    setSelectedDate(date);
    const dayTasks = getTasksByDate(date);
    setSelectedTasks(dayTasks);
    setIsModalVisible(true);
  };

  // Set reminder for a task
  const setReminder = (task, time) => {
    const reminderDateTime = moment(selectedDate)
      .set('hour', time.hour())
      .set('minute', time.minute())
      .set('second', 0);

    const updatedTask = {
      ...task,
      reminder: reminderDateTime.toISOString(),
      reminderSet: true
    };

    onUpdateTask(task.id, updatedTask);
    
    // Schedule notification
    scheduleNotification(updatedTask, reminderDateTime);
    
    message.success(`Reminder set for ${reminderDateTime.format('MMM DD, YYYY h:mm A')}`);
  };

  // Schedule browser notification
  const scheduleNotification = (task, reminderTime) => {
    const now = moment();
    const delay = reminderTime.diff(now);
    
    if (delay > 0) {
      setTimeout(() => {
        // Check if notification permission is granted
        if (Notification.permission === 'granted') {
          new Notification('Task Reminder', {
            body: `Don't forget: ${task.value}`,
            icon: '/favicon.ico',
            tag: task.id
          });
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission();
        }
        
        // Also show antd notification
        message.info(`⏰ Reminder: ${task.value}`);
      }, delay);
    }
  };

  // Request notification permission on component mount
  React.useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <>
      <div style={{ 
        background: isDarkMode ? '#1f1f1f' : '#fff',
        borderRadius: '12px',
        padding: isMobile ? '12px' : '20px',
        marginBottom: '24px'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px'
        }}>
          <h3 style={{ 
            color: isDarkMode ? '#fff' : '#333',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CalendarOutlined /> Task Calendar
          </h3>
          <Badge 
            count={tasks.filter(t => t.dueDate && !t.completed).length} 
            style={{ background: '#1890ff' }}
          />
        </div>

        <Calendar
          fullscreen={false}
          onSelect={onSelectDate}
          dateCellRender={dateCellRender}
          style={{
            background: isDarkMode ? '#1f1f1f' : '#fff',
            borderRadius: '8px',
            padding: '8px'
          }}
        />
      </div>

      {/* Tasks for selected date modal */}
      <Modal
        title={`Tasks for ${selectedDate.format('MMMM DD, YYYY')}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={isMobile ? '90%' : 500}
        style={{ top: isMobile ? 20 : 100 }}
      >
        {selectedTasks.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#999'
          }}>
            <CalendarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <p>No tasks scheduled for this day</p>
          </div>
        ) : (
          <List
            dataSource={selectedTasks}
            renderItem={task => (
              <List.Item
                style={{
                  padding: '12px',
                  background: isDarkMode ? '#2d2d2d' : '#f8f9fa',
                  borderRadius: '8px',
                  marginBottom: '8px'
                }}
              >
                <div style={{ width: '100%' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    marginBottom: '8px'
                  }}>
                    <Space>
                      <CheckCircleOutlined 
                        style={{ 
                          color: task.completed ? '#52c41a' : '#d9d9d9',
                          cursor: 'pointer',
                          fontSize: '18px'
                        }}
                        onClick={() => onUpdateTask(task.id, { 
                          ...task, 
                          completed: !task.completed 
                        })}
                      />
                      <span style={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: isDarkMode ? '#fff' : '#333',
                        fontWeight: task.completed ? 'normal' : '500'
                      }}>
                        {task.value}
                      </span>
                    </Space>
                    <Tag color={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'}>
                      {task.priority}
                    </Tag>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <Space size={4} wrap>
                      <ClockCircleOutlined style={{ color: '#1890ff' }} />
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {moment(task.dueDate).format('h:mm A')}
                      </span>
                      
                      {task.reminder && (
                        <Tag color="purple" style={{ marginLeft: 8 }}>
                          <BellOutlined /> Reminder set
                        </Tag>
                      )}
                    </Space>

                    <Space size={4}>
                      <TimePicker
                        size="small"
                        format="h:mm A"
                        placeholder="Set reminder"
                        onChange={(time) => setReminder(task, time)}
                        style={{ width: isMobile ? '100px' : '120px' }}
                      />
                      {task.reminder && (
                        <Button 
                          size="small"
                          danger
                          icon={<CloseOutlined />}
                          onClick={() => {
                            onUpdateTask(task.id, { ...task, reminder: null });
                            message.info('Reminder removed');
                          }}
                        />
                      )}
                    </Space>
                  </div>
                </div>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </>
  );
};

export default CalendarView;