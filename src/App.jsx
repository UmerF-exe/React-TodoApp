import './App.css';
import { useState } from 'react';
import { 
  Layout, 
  Input, 
  Button, 
  List, 
  Space, 
  Typography, 
  Card,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  CheckOutlined,
  DeleteFilled 
} from '@ant-design/icons';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [tasks, setTasks] = useState([
    { value: "Do workout", disabled: true },
    { value: "Breakfast time", disabled: true }
  ]);
  const [value, setValue] = useState("");

  const addTask = () => {
    if (value.trim()) {
      setTasks([...tasks, { value, disabled: true }]);
      setValue("");
      message.success('Task added successfully!');
    } else {
      message.warning('Please enter a task!');
    }
  }

  const deleteTask = (i) => {
    const newTasks = [...tasks];
    newTasks.splice(i, 1);
    setTasks(newTasks);
    message.info('Task deleted');
  }

  const editTask = (i) => {
    tasks.splice(i, 1, { value: tasks[i].value, disabled: !tasks[i].disabled });
    setTasks([...tasks]);
  }

  const updateTask = (v, i) => {
    v.disabled = true;
    setTasks([...tasks]);
    message.success('Task updated!');
  }

  const deleteAllTasks = () => {
    if (tasks.length > 0) {
      setTasks([]);
      message.info('All tasks deleted');
    }
  }

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{ padding: '50px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <Card 
          style={{ 
            borderRadius: '16px', 
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            background: 'rgba(255, 255, 255, 0.95)'
          }}
        >
          <Title level={1} style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
            Tasks List
          </Title>
          
          <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
            <Input 
              size="large"
              placeholder="Add a new task..." 
              value={value} 
              onChange={(e) => setValue(e.target.value)}
              onPressEnter={addTask}
              style={{ borderRadius: '8px 0 0 8px' }}
            />
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={addTask}
              style={{ borderRadius: '0 8px 8px 0' }}
            >
              Add Task
            </Button>
          </Space.Compact>

          <Button 
            danger
            size="large"
            icon={<DeleteFilled />}
            onClick={deleteAllTasks}
            style={{ marginBottom: '30px', width: '100%', borderRadius: '8px' }}
            disabled={tasks.length === 0}
          >
            Delete All Tasks
          </Button>

          <List
            dataSource={tasks}
            renderItem={(task, index) => (
              <List.Item
                style={{ 
                  padding: '12px', 
                  borderRadius: '8px',
                  background: index % 2 === 0 ? '#f8f9fa' : '#ffffff',
                  marginBottom: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <Space.Compact style={{ width: '100%' }}>
                  <Input 
                    size="large"
                    defaultValue={task.value}
                    disabled={task.disabled}
                    onChange={(e) => task.value = e.target.value}
                    style={{ 
                      flex: 1,
                      borderRadius: '8px 0 0 8px',
                      textDecoration: task.disabled ? 'none' : 'underline',
                      fontWeight: task.disabled ? 'normal' : 'bold'
                    }}
                  />
                  {task.disabled ? (
                    <Button 
                      type="primary"
                      size="large"
                      icon={<EditOutlined />}
                      onClick={() => editTask(index)}
                      style={{ borderRadius: '0' }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button 
                      type="primary"
                      size="large"
                      icon={<CheckOutlined />}
                      onClick={() => updateTask(task, index)}
                      style={{ borderRadius: '0', background: '#52c41a' }}
                    >
                      Update
                    </Button>
                  )}
                  <Button 
                    danger
                    size="large"
                    icon={<DeleteOutlined />}
                    onClick={() => deleteTask(index)}
                    style={{ borderRadius: '0 8px 8px 0' }}
                  />
                </Space.Compact>
              </List.Item>
            )}
          />
        </Card>
      </Content>
    </Layout>
  );
}

export default App;