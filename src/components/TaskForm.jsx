import React, { useState } from 'react';
import { 
  Space, 
  Input, 
  Button, 
  Select, 
  DatePicker,
  Row,
  Col,
  Tooltip
} from 'antd';
import { 
  PlusOutlined,
  CalendarOutlined,
  FlagOutlined,
  FolderOutlined
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const TaskForm = ({ categories, priorities, onAddTask, inputRef, isMobile }) => {
  const [formData, setFormData] = useState({
    value: '',
    category: 'personal',
    priority: 'medium',
    dueDate: null,
    tags: [],
    notes: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = () => {
    if (formData.value.trim()) {
      onAddTask(formData);
      setFormData({
        value: '',
        category: 'personal',
        priority: 'medium',
        dueDate: null,
        tags: [],
        notes: ''
      });
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: isMobile ? 16 : 24 }}>
      {/* Main input row - responsive */}
      <div style={{ display: 'flex', gap: '4px', width: '100%' }}>
        <Input 
          ref={inputRef}
          size={isMobile ? 'middle' : 'large'}
          placeholder={isMobile ? "Add task..." : "What needs to be done?"}
          value={formData.value}
          onChange={(e) => setFormData({ ...formData, value: e.target.value })}
          onPressEnter={handleSubmit}
          style={{ 
            borderRadius: isMobile ? '8px' : '8px 0 0 8px',
            flex: 1
          }}
          prefix={<FolderOutlined style={{ color: '#bfbfbf' }} />}
        />
        
        <Tooltip title="Add Task">
          <Button 
            type="primary"
            size={isMobile ? 'middle' : 'large'}
            icon={<PlusOutlined />}
            onClick={handleSubmit}
            style={{ 
              borderRadius: isMobile ? '8px' : '0 8px 8px 0',
              minWidth: isMobile ? 'auto' : '80px'
            }}
          >
            {!isMobile && 'Add'}
          </Button>
        </Tooltip>
      </div>

      {/* Quick options - responsive grid */}
      <Row gutter={[8, 8]}>
        <Col xs={24} sm={8}>
          <Select
            style={{ width: '100%' }}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            size={isMobile ? 'small' : 'middle'}
            dropdownMatchSelectWidth={false}
          >
            {categories.map(cat => (
              <Option key={cat.value} value={cat.value}>
                <span style={{ color: cat.color }}>●</span> {isMobile ? cat.label : cat.label}
              </Option>
            ))}
          </Select>
        </Col>
        
        <Col xs={12} sm={8}>
          <Select
            style={{ width: '100%' }}
            value={formData.priority}
            onChange={(value) => setFormData({ ...formData, priority: value })}
            size={isMobile ? 'small' : 'middle'}
            dropdownMatchSelectWidth={false}
          >
            {priorities.map(p => (
              <Option key={p.value} value={p.value}>
                <FlagOutlined style={{ color: p.color }} /> {!isMobile && p.label}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={12} sm={8}>
          <DatePicker
            style={{ width: '100%' }}
            placeholder={isMobile ? "Due" : "Due date"}
            value={formData.dueDate ? moment(formData.dueDate) : null}
            onChange={(date) => setFormData({ 
              ...formData, 
              dueDate: date ? date.toISOString() : null 
            })}
            size={isMobile ? 'small' : 'middle'}
            suffixIcon={<CalendarOutlined />}
            format={isMobile ? "MM/DD" : "YYYY-MM-DD"}
          />
        </Col>
      </Row>

      {/* Advanced options toggle */}
      <Button 
        type="link" 
        onClick={() => setShowAdvanced(!showAdvanced)}
        style={{ padding: isMobile ? '4px 0' : 0, fontSize: isMobile ? '12px' : '14px' }}
        size={isMobile ? 'small' : 'middle'}
      >
        {showAdvanced ? 'Hide' : 'Show'} advanced options
      </Button>

      {/* Advanced options */}
      {showAdvanced && (
        <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 8 : 12}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Add tags"
            value={formData.tags}
            onChange={(tags) => setFormData({ ...formData, tags })}
            size={isMobile ? 'small' : 'middle'}
          />
          
          <TextArea
            rows={isMobile ? 1 : 2}
            placeholder="Additional notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            size={isMobile ? 'small' : 'middle'}
          />
        </Space>
      )}
    </Space>
  );
};

export default TaskForm;