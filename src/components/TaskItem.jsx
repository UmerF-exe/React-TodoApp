import React, { useState } from 'react';
import { 
  Card, 
  Tag, 
  Button, 
  Space, 
  Input, 
  Progress,
  Tooltip,
  Dropdown,
  Menu,
  Checkbox,
  Collapse,
  Modal,
  message
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CheckOutlined,
  ClockCircleOutlined,
  DownOutlined,
  PlusOutlined,
  FlagOutlined,
  MoreOutlined,
  BellOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import moment from 'moment';

const { Panel } = Collapse;

const TaskItem = ({ 
  task, 
  index, 
  categories, 
  priorities, 
  onUpdate, 
  onDelete,
  onToggleComplete,
  onAddSubtask,
  onToggleSubtask,
  isDarkMode,
  isMobile,
  playTaskCompleteSound,
  playReminderSound
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(task.value);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [reminderModalVisible, setReminderModalVisible] = useState(false);

  const category = categories.find(c => c.value === task.category) || categories[0];
  const priority = priorities.find(p => p.value === task.priority) || priorities[1];

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date();

  const handleUpdate = () => {
    onUpdate(task.id, { value: editedValue, disabled: true });
    setIsEditing(false);
  };

  const handleAddSubtask = () => {
    if (subtaskInput.trim()) {
      onAddSubtask(task.id, subtaskInput);
      setSubtaskInput('');
    }
  };

  const priorityMenu = (
    <Menu onClick={(e) => onUpdate(task.id, { priority: e.key })}>
      {priorities.map(p => (
        <Menu.Item key={p.value} icon={<FlagOutlined style={{ color: p.color }} />}>
          {p.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  const actionMenu = (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
        Edit
      </Menu.Item>
      <Menu.Item key="priority" icon={<FlagOutlined />}>
        <Dropdown overlay={priorityMenu} trigger={['click']} placement="right">
          <span>Change Priority</span>
        </Dropdown>
      </Menu.Item>
      <Menu.Item key="reminder" icon={<BellOutlined />} onClick={() => setReminderModalVisible(true)}>
        Set Reminder
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} danger onClick={() => onDelete(task.id)}>
        Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={!isMobile ? { scale: 1.02 } : {}}
    >
      <Card 
        size="small"
        style={{ 
          marginBottom: isMobile ? 8 : 12,
          background: isDarkMode ? '#2d2d2d' : '#fff',
          borderLeft: `4px solid ${category.color}`,
          opacity: task.completed ? 0.7 : 1,
          transition: 'all 0.3s ease'
        }}
        hoverable={!isMobile}
        bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 6 : 8}>
          {/* Main task row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Checkbox 
              checked={task.completed}
              onChange={() => {
                onToggleComplete(task.id);
                if (!task.completed && playTaskCompleteSound) {
                  playTaskCompleteSound();
                }
              }}
              style={{ marginRight: 4 }}
            />
            
            {isEditing ? (
              <Input
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                onPressEnter={handleUpdate}
                onBlur={handleUpdate}
                autoFocus
                style={{ flex: 1, minWidth: isMobile ? '150px' : '200px' }}
                size={isMobile ? 'middle' : 'large'}
              />
            ) : (
              <span 
                style={{ 
                  flex: 1,
                  textDecoration: task.completed ? 'line-through' : 'none',
                  color: isDarkMode ? '#fff' : 'inherit',
                  fontSize: isMobile ? '14px' : '16px',
                  wordBreak: 'break-word'
                }}
                onDoubleClick={() => !task.completed && !isMobile && setIsEditing(true)}
              >
                {task.value}
              </span>
            )}

            {isMobile ? (
              // Mobile actions dropdown
              <Dropdown overlay={actionMenu} trigger={['click']} placement="bottomRight">
                <Button icon={<MoreOutlined />} size="small" />
              </Dropdown>
            ) : (
              // Desktop actions
              <>
                <Dropdown overlay={priorityMenu} trigger={['click']}>
                  <Button 
                    icon={<FlagOutlined style={{ color: priority.color }} />}
                    size="small"
                  />
                </Dropdown>

                <Button 
                  type="text"
                  size="small"
                  icon={<BellOutlined />}
                  onClick={() => setReminderModalVisible(true)}
                  style={{ color: task.reminder ? '#722ed1' : '#999' }}
                />

                {isEditing ? (
                  <Button 
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleUpdate}
                    size="small"
                    style={{ background: '#52c41a' }}
                  />
                ) : (
                  <Button 
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => setIsEditing(true)}
                    disabled={task.completed}
                    size="small"
                  />
                )}

                <Button 
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => onDelete(task.id)}
                  size="small"
                />
              </>
            )}
          </div>

          {/* Metadata row - responsive */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
            <Tag color={category.color} style={{ marginRight: 4, fontSize: isMobile ? '11px' : '12px' }}>
              {category.label}
            </Tag>
            <Tag color={priority.color} style={{ marginRight: 4, fontSize: isMobile ? '11px' : '12px' }}>
              {priority.label}
            </Tag>
            
            {task.dueDate && (
              <Tooltip title="Due Date">
                <Tag color={isOverdue ? 'red' : 'blue'} style={{ fontSize: isMobile ? '11px' : '12px' }}>
                  <ClockCircleOutlined /> {moment(task.dueDate).format(isMobile ? 'MM/DD' : 'MMM DD, YYYY')}
                  {isOverdue && !isMobile && ' (Overdue)'}
                </Tag>
              </Tooltip>
            )}

            {task.reminder && (
              <Tooltip title={`Reminder: ${moment(task.reminder).format('MMM DD, h:mm A')}`}>
                <Tag color="purple" style={{ cursor: 'pointer', fontSize: isMobile ? '11px' : '12px' }}>
                  <BellOutlined /> {moment(task.reminder).fromNow()}
                </Tag>
              </Tooltip>
            )}

            {!isMobile && task.tags && task.tags.length > 0 && task.tags.map(tag => (
              <Tag key={tag} style={{ fontSize: '12px' }}>{tag}</Tag>
            ))}

            <Button 
              type="link" 
              size="small"
              onClick={() => setShowSubtasks(!showSubtasks)}
              icon={<DownOutlined rotate={showSubtasks ? 180 : 0} />}
              style={{ padding: isMobile ? '0 4px' : '0 8px' }}
            >
              {isMobile ? `${task.subtasks?.length || 0}` : `Subtasks (${task.subtasks?.filter(st => st.completed).length || 0}/${task.subtasks?.length || 0})`}
            </Button>
          </div>

          {/* Progress bar */}
          {task.subtasks?.length > 0 && (
            <Progress 
              percent={Math.round(task.progress || 0)} 
              size="small"
              status={task.progress === 100 ? 'success' : 'active'}
              strokeColor={category.color}
              style={{ marginTop: 4 }}
            />
          )}

          {/* Subtasks section - collapsible on mobile */}
          {showSubtasks && (
            <Collapse ghost style={{ background: 'transparent' }}>
              <Panel header="Subtasks" key="1" style={{ border: 'none' }}>
                <Space direction="vertical" style={{ width: '100%' }} size={4}>
                  {/* Subtask list */}
                  {task.subtasks?.map(subtask => (
                    <div key={subtask.id} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      padding: '4px 0'
                    }}>
                      <Checkbox
                        checked={subtask.completed}
                        onChange={() => {
                          onToggleSubtask(task.id, subtask.id);
                          if (!subtask.completed && playTaskCompleteSound) {
                            playTaskCompleteSound();
                          }
                        }}
                        size={isMobile ? 'small' : 'default'}
                      >
                        <span style={{ 
                          textDecoration: subtask.completed ? 'line-through' : 'none',
                          color: isDarkMode ? '#fff' : 'inherit',
                          fontSize: isMobile ? '13px' : '14px'
                        }}>
                          {subtask.value}
                        </span>
                      </Checkbox>
                    </div>
                  ))}

                  {/* Add subtask input */}
                  <div style={{ display: 'flex', gap: '4px', marginTop: 8 }}>
                    <Input
                      placeholder="Add subtask..."
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      onPressEnter={handleAddSubtask}
                      size={isMobile ? 'small' : 'middle'}
                      style={{ flex: 1 }}
                    />
                    <Button 
                      type="dashed" 
                      icon={<PlusOutlined />}
                      onClick={handleAddSubtask}
                      size={isMobile ? 'small' : 'middle'}
                    >
                      {!isMobile && 'Add'}
                    </Button>
                  </div>
                </Space>
              </Panel>
            </Collapse>
          )}
        </Space>
      </Card>

      {/* Reminder Modal */}
      <Modal
        title="Set Reminder"
        open={reminderModalVisible}
        onCancel={() => setReminderModalVisible(false)}
        footer={null}
        width={isMobile ? '90%' : 400}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <p style={{ textAlign: 'center', marginBottom: 20 }}>
            When would you like to be reminded?
          </p>
          
          <Button 
            block
            icon={<ClockCircleOutlined />}
            onClick={() => {
              const reminderTime = moment().add(30, 'minutes');
              onUpdate(task.id, { 
                ...task, 
                reminder: reminderTime.toISOString(),
                reminderNotified: false
              });
              setReminderModalVisible(false);
              message.success('Reminder set for 30 minutes');
              if (playReminderSound) playReminderSound();
            }}
          >
            In 30 minutes
          </Button>
          
          <Button 
            block
            icon={<ClockCircleOutlined />}
            onClick={() => {
              const reminderTime = moment().add(1, 'hour');
              onUpdate(task.id, { 
                ...task, 
                reminder: reminderTime.toISOString(),
                reminderNotified: false
              });
              setReminderModalVisible(false);
              message.success('Reminder set for 1 hour');
              if (playReminderSound) playReminderSound();
            }}
          >
            In 1 hour
          </Button>
          
          <Button 
            block
            icon={<ClockCircleOutlined />}
            onClick={() => {
              const reminderTime = moment().add(1, 'day');
              onUpdate(task.id, { 
                ...task, 
                reminder: reminderTime.toISOString(),
                reminderNotified: false
              });
              setReminderModalVisible(false);
              message.success('Reminder set for tomorrow');
              if (playReminderSound) playReminderSound();
            }}
          >
            Tomorrow
          </Button>
          
          {task.dueDate && (
            <Button 
              block
              type="primary"
              icon={<CalendarOutlined />}
              onClick={() => {
                onUpdate(task.id, { 
                  ...task, 
                  reminder: task.dueDate,
                  reminderNotified: false
                });
                setReminderModalVisible(false);
                message.success('Reminder set for due date');
                if (playReminderSound) playReminderSound();
              }}
            >
              At Due Date
            </Button>
          )}
          
          {task.reminder && (
            <Button 
              block
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                onUpdate(task.id, { ...task, reminder: null });
                setReminderModalVisible(false);
                message.info('Reminder removed');
              }}
            >
              Remove Reminder
            </Button>
          )}
        </Space>
      </Modal>
    </motion.div>
  );
};

export default TaskItem;