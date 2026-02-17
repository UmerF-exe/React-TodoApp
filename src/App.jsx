import React, { useState, useEffect, useRef } from 'react';
import { 
  Layout, 
  Card, 
  Typography, 
  message,
  BackTop,
  Row,
  Col,
  Button,
  Modal,
  Space,
  Grid
} from 'antd';
import { 
  UndoOutlined, 
  RedoOutlined, 
  ExportOutlined, 
  ImportOutlined,
  BulbOutlined,
  ExclamationCircleOutlined,
  MenuOutlined,
  AudioOutlined,
  CalendarOutlined,
  BellOutlined
} from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import moment from 'moment';

// Custom Components
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import TaskTemplates from './components/TaskTemplates';
import VoiceInput from './components/VoiceInput';
import DarkModeToggle from './components/DarkModeToggle';
import MobileMenu from './components/MobileMenu';
import CalendarView from './components/CalendarView';
import ReminderSettings from './components/ReminderSettings';

// Custom Hooks
import useLocalStorage from './hooks/useLocalStorage';
import useWindowSize from './hooks/useWindowSize';

// Utils
import { exportTasks, importTasks } from './utils/taskHelpers';

const { useBreakpoint } = Grid;
const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;

function App() {
  const screens = useBreakpoint();
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 550;
  const isTablet = windowSize.width >= 550 && windowSize.width < 768;

  // State management
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [mobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  
  const inputRef = useRef(null);

  // Categories with Study added
  const categories = [
    { value: 'personal', label: 'Personal', color: '#1890ff' },
    { value: 'work', label: 'Work', color: '#722ed1' },
    { value: 'shopping', label: 'Shopping', color: '#13c2c2' },
    { value: 'health', label: 'Health', color: '#52c41a' },
    { value: 'study', label: 'Study', color: '#fa8c16' }
  ];

  const priorities = [
    { value: 'high', label: 'High', color: '#ff4d4f' },
    { value: 'medium', label: 'Medium', color: '#faad14' },
    { value: 'low', label: 'Low', color: '#52c41a' }
  ];

  // Web Audio API beep function
  const playBeepSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create oscillator for beep sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set oscillator type and frequency
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      
      // Set volume (gain)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      // Play beep
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // Success beep pattern for completed task
      const playSuccessBeep = () => {
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gainNode1 = audioContext.createGain();
        const gainNode2 = audioContext.createGain();
        
        osc1.connect(gainNode1);
        osc2.connect(gainNode2);
        gainNode1.connect(audioContext.destination);
        gainNode2.connect(audioContext.destination);
        
        osc1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        osc2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
        
        gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
        
        osc1.start(audioContext.currentTime);
        osc2.start(audioContext.currentTime);
        osc1.stop(audioContext.currentTime + 0.15);
        osc2.stop(audioContext.currentTime + 0.15);
      };

      // Store the function for later use
      window.playSuccessBeep = playSuccessBeep;
      
    } catch (error) {
      console.log('Web Audio API not supported:', error);
    }
  };

  // Initialize audio on component mount
  useEffect(() => {
    playBeepSound();
  }, []);

  // Play success sound when task is completed
  const playTaskCompleteSound = () => {
    try {
      if (window.playSuccessBeep) {
        window.playSuccessBeep();
      } else {
        // Fallback simple beep
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  // Play reminder sound
  const playReminderSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create a more noticeable reminder sound
      for (let i = 0; i < 3; i++) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(440 + (i * 100), audioContext.currentTime + (i * 0.2));
        
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + (i * 0.2));
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + (i * 0.2) + 0.1);
        
        oscillator.start(audioContext.currentTime + (i * 0.2));
        oscillator.stop(audioContext.currentTime + (i * 0.2) + 0.1);
      }
    } catch (error) {
      console.log('Error playing reminder sound:', error);
    }
  };

  // Filter and sort tasks
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.subtasks && task.subtasks.some(st => st.value.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(task => task.category === filterCategory);
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch(sortBy) {
        case 'dueDate':
          return moment(a.dueDate).diff(moment(b.dueDate));
        case 'priority':
          const priorityOrder = { high: 1, medium: 2, low: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredTasks(filtered);
  }, [tasks, searchTerm, filterCategory, filterPriority, filterStatus, sortBy]);

  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const now = moment();
      tasks.forEach(task => {
        if (task.reminder && !task.reminderNotified) {
          const reminderTime = moment(task.reminder);
          const diffMinutes = reminderTime.diff(now, 'minutes');
          
          if (diffMinutes >= 0 && diffMinutes <= 1) {
            // Play reminder sound
            playReminderSound();
            
            // Show notification
            message.warning({
              content: `⏰ Reminder: ${task.value}`,
              duration: 10,
              icon: <BellOutlined />
            });

            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
              new Notification('Task Reminder', {
                body: task.value,
                icon: '/favicon.ico'
              });
            }

            // Mark as notified
            updateTask(task.id, { ...task, reminderNotified: true });
          }
        }
      });
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        showDeleteAllConfirm();
      }
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault();
        setShowCalendar(!showCalendar);
      }
      if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        setShowReminders(!showReminders);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [history, redoStack, tasks, showCalendar, showReminders]);

  // Add to history for undo/redo
  const addToHistory = (newTasks, action) => {
    setHistory([...history, { tasks: tasks, action }]);
    setTasks(newTasks);
    setRedoStack([]);
    message.success(`${action} successful!`);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const previous = history[history.length - 1];
      setRedoStack([{ tasks: tasks, action: 'redo' }, ...redoStack]);
      setTasks(previous.tasks);
      setHistory(history.slice(0, -1));
      message.info('Undo successful');
    } else {
      message.warning('No actions to undo');
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[0];
      setHistory([...history, { tasks: tasks, action: 'redo' }]);
      setTasks(next.tasks);
      setRedoStack(redoStack.slice(1));
      message.info('Redo successful');
    } else {
      message.warning('No actions to redo');
    }
  };

  // Task CRUD operations
  const addTask = (taskData) => {
    if (taskData.value.trim()) {
      const newTask = {
        id: Date.now(),
        value: taskData.value,
        disabled: true,
        completed: false,
        category: taskData.category || 'personal',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || null,
        createdAt: new Date().toISOString(),
        tags: taskData.tags || [],
        subtasks: [],
        reminders: [],
        notes: '',
        progress: 0,
        reminder: null,
        reminderNotified: false
      };

      addToHistory([...tasks, newTask], 'Added task');
      
      // Auto-scroll to new task on mobile
      if (isMobile) {
        setTimeout(() => {
          document.getElementById(`task-${newTask.id}`)?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }, 100);
      }
    }
  };

  const updateTask = (id, updates) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      const newTasks = [...tasks];
      newTasks[taskIndex] = { ...newTasks[taskIndex], ...updates };
      
      // Calculate progress based on subtasks
      if (newTasks[taskIndex].subtasks.length > 0) {
        const completedSubtasks = newTasks[taskIndex].subtasks.filter(st => st.completed).length;
        newTasks[taskIndex].progress = (completedSubtasks / newTasks[taskIndex].subtasks.length) * 100;
      }

      addToHistory(newTasks, 'Updated task');
    }
  };

  const deleteTask = (id) => {
    if (isMobile) {
      // Simpler confirmation for mobile
      if (window.confirm('Are you sure you want to delete this task?')) {
        const newTasks = tasks.filter(task => task.id !== id);
        addToHistory(newTasks, 'Deleted task');
      }
    } else {
      confirm({
        title: 'Are you sure you want to delete this task?',
        icon: <ExclamationCircleOutlined />,
        content: 'This action cannot be undone.',
        onOk() {
          const newTasks = tasks.filter(task => task.id !== id);
          addToHistory(newTasks, 'Deleted task');
        }
      });
    }
  };

  const toggleComplete = (id) => {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex !== -1) {
      const newTasks = [...tasks];
      newTasks[taskIndex].completed = !newTasks[taskIndex].completed;
      
      // Play success sound when task is completed
      if (newTasks[taskIndex].completed) {
        playTaskCompleteSound();
        message.success(`🎉 Great job completing: ${newTasks[taskIndex].value}`);
      }

      addToHistory(newTasks, 'Toggled completion');
    }
  };

  // Subtask management
  const addSubtask = (taskId, subtaskValue) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1 && subtaskValue.trim()) {
      const newTasks = [...tasks];
      if (!newTasks[taskIndex].subtasks) {
        newTasks[taskIndex].subtasks = [];
      }
      newTasks[taskIndex].subtasks.push({
        id: Date.now(),
        value: subtaskValue,
        completed: false
      });
      addToHistory(newTasks, 'Added subtask');
    }
  };

  const toggleSubtask = (taskId, subtaskId) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      const newTasks = [...tasks];
      const subtaskIndex = newTasks[taskIndex].subtasks.findIndex(st => st.id === subtaskId);
      if (subtaskIndex !== -1) {
        newTasks[taskIndex].subtasks[subtaskIndex].completed = 
          !newTasks[taskIndex].subtasks[subtaskIndex].completed;
        
        // Update task progress
        const completedSubtasks = newTasks[taskIndex].subtasks.filter(st => st.completed).length;
        newTasks[taskIndex].progress = (completedSubtasks / newTasks[taskIndex].subtasks.length) * 100;
        
        // Play sound when all subtasks are completed
        if (newTasks[taskIndex].progress === 100) {
          playTaskCompleteSound();
        }
        
        addToHistory(newTasks, 'Updated subtask');
      }
    }
  };

  // Export/Import tasks
  const handleExport = () => {
    exportTasks(tasks);
    message.success('Tasks exported successfully!');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      importTasks(file, (importedTasks) => {
        setTasks(importedTasks);
        message.success('Tasks imported successfully!');
      });
    }
  };

  // Delete all tasks confirmation
  const showDeleteAllConfirm = () => {
    if (isMobile) {
      if (window.confirm('Delete all tasks? This action cannot be undone.')) {
        addToHistory([], 'Deleted all tasks');
      }
    } else {
      confirm({
        title: 'Delete all tasks?',
        icon: <ExclamationCircleOutlined />,
        content: 'This action cannot be undone. All tasks will be permanently deleted.',
        okText: 'Yes, delete all',
        okType: 'danger',
        cancelText: 'No, cancel',
        onOk() {
          addToHistory([], 'Deleted all tasks');
        }
      });
    }
  };

  // Load template
  const loadTemplate = (templateName) => {
    const templates = {
      'Daily Routine': ['Wake up', 'Exercise', 'Breakfast', 'Work', 'Lunch', 'Study', 'Dinner', 'Read'],
      'Shopping': ['Groceries', 'Electronics', 'Clothes', 'Books', 'Household items'],
      'Meeting': ['Prepare agenda', 'Send invites', 'Take notes', 'Follow up emails'],
      'Study Session': ['Review notes', 'Complete assignments', 'Research topic', 'Practice problems', 'Take breaks']
    };

    const templateTasks = templates[templateName].map((t, index) => ({
      id: Date.now() + index,
      value: t,
      disabled: true,
      completed: false,
      category: templateName === 'Study Session' ? 'study' : 'personal',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      subtasks: [],
      progress: 0,
      reminder: null,
      reminderNotified: false
    }));

    addToHistory([...tasks, ...templateTasks], `Loaded ${templateName} template`);
  };

  // Responsive padding
  const contentPadding = isMobile ? '10px' : '20px';
  const cardPadding = isMobile ? '12px' : '24px';

  return (
    <Layout 
      style={{ 
        minHeight: '100vh', 
        background: isDarkMode 
          ? '#141414' 
          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        transition: 'background 0.3s ease'
      }}
    >
      <BackTop visibilityHeight={100} />
      
      <Content style={{ padding: contentPadding, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card 
            style={{ 
              borderRadius: isMobile ? '12px' : '16px', 
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              background: isDarkMode ? '#1f1f1f' : 'rgba(255, 255, 255, 0.95)',
              color: isDarkMode ? '#fff' : 'inherit'
            }}
            bodyStyle={{ padding: cardPadding }}
          >
            {/* Header with responsive design */}
            <Row justify="space-between" align="middle" style={{ marginBottom: isMobile ? 12 : 20 }}>
              <Col>
                <Title level={isMobile ? 3 : 1} style={{ 
                  color: isDarkMode ? '#fff' : '#333', 
                  margin: 0,
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: isMobile ? '24px' : '38px'
                }}>
                  {isMobile ? 'Tasks' : 'TaskFlow Pro'}
                </Title>
              </Col>
              <Col>
                {isMobile ? (
                  // Mobile menu button
                  <Button 
                    type="primary"
                    icon={<MenuOutlined />}
                    onClick={() => setMobileMenuVisible(true)}
                    size="large"
                  />
                ) : (
                  // Desktop buttons
                  <Space size={isTablet ? 'small' : 'middle'} wrap>
                    <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                    
                    <Button 
                      icon={<CalendarOutlined />}
                      onClick={() => setShowCalendar(!showCalendar)}
                      size={isTablet ? 'middle' : 'large'}
                      type={showCalendar ? 'primary' : 'default'}
                    >
                      {!isTablet && 'Calendar'}
                    </Button>

                    <Button 
                      icon={<BellOutlined />}
                      onClick={() => setShowReminders(!showReminders)}
                      size={isTablet ? 'middle' : 'large'}
                      type={showReminders ? 'primary' : 'default'}
                    >
                      {!isTablet && 'Reminders'}
                    </Button>
                    
                    <Button 
                      icon={<UndoOutlined />} 
                      onClick={handleUndo}
                      disabled={history.length === 0}
                      size={isTablet ? 'middle' : 'large'}
                    >
                      {!isTablet && 'Undo'}
                    </Button>
                    <Button 
                      icon={<RedoOutlined />} 
                      onClick={handleRedo}
                      disabled={redoStack.length === 0}
                      size={isTablet ? 'middle' : 'large'}
                    >
                      {!isTablet && 'Redo'}
                    </Button>
                    <Button icon={<ExportOutlined />} onClick={handleExport} size={isTablet ? 'middle' : 'large'}>
                      {!isTablet && 'Export'}
                    </Button>
                    <Button icon={<ImportOutlined />} onClick={() => document.getElementById('import-file').click()} size={isTablet ? 'middle' : 'large'}>
                      {!isTablet && 'Import'}
                    </Button>
                    <input
                      type="file"
                      id="import-file"
                      style={{ display: 'none' }}
                      accept=".json"
                      onChange={handleImport}
                    />
                  </Space>
                )}
              </Col>
            </Row>

            {/* Mobile Menu */}
            <MobileMenu
              visible={mobileMenuVisible}
              onClose={() => setMobileMenuVisible(false)}
              isDarkMode={isDarkMode}
              setIsDarkMode={setIsDarkMode}
              handleUndo={handleUndo}
              handleRedo={handleRedo}
              handleExport={handleExport}
              handleImport={handleImport}
              historyLength={history.length}
              redoStackLength={redoStack.length}
              setShowCalendar={setShowCalendar}
              setShowReminders={setShowReminders}
              showCalendar={showCalendar}
              showReminders={showReminders}
            />

            {/* Task Statistics - Hide on very small screens */}
            {!isMobile && <TaskStats tasks={tasks} categories={categories} />}

            {/* Task Form */}
            <TaskForm 
              categories={categories}
              priorities={priorities}
              onAddTask={addTask}
              inputRef={inputRef}
              isMobile={isMobile}
            />

            {/* Voice Input - Now visible on all devices */}
            <VoiceInput 
              onVoiceInput={(text) => addTask({ value: text })} 
              isMobile={isMobile}
            />

            {/* Templates - Stack vertically on mobile */}
            <TaskTemplates onLoadTemplate={loadTemplate} isMobile={isMobile} />

            {/* Filters - Adjust for mobile */}
            <TaskFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              categories={categories}
              priorities={priorities}
              isMobile={isMobile}
            />

            {/* Calendar View */}
            {showCalendar && (
              <CalendarView 
                tasks={tasks}
                onUpdateTask={updateTask}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
                playReminderSound={playReminderSound}
              />
            )}

            {/* Reminder Settings */}
            {showReminders && (
              <ReminderSettings
                tasks={tasks}
                onUpdateTask={updateTask}
                isDarkMode={isDarkMode}
                isMobile={isMobile}
                playReminderSound={playReminderSound}
              />
            )}

            {/* Tasks List */}
            <AnimatePresence>
              {filteredTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    textAlign: 'center', 
                    padding: isMobile ? '20px' : '40px',
                    color: isDarkMode ? '#888' : '#999'
                  }}
                >
                  <BulbOutlined style={{ fontSize: isMobile ? 32 : 48, marginBottom: 16 }} />
                  <Typography.Text>
                    No tasks found. Add a new task to get started!
                  </Typography.Text>
                </motion.div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div id={`task-${task.id}`} key={task.id}>
                    <TaskItem
                      task={task}
                      index={index}
                      categories={categories}
                      priorities={priorities}
                      onUpdate={updateTask}
                      onDelete={deleteTask}
                      onToggleComplete={toggleComplete}
                      onAddSubtask={addSubtask}
                      onToggleSubtask={toggleSubtask}
                      isDarkMode={isDarkMode}
                      isMobile={isMobile}
                      playTaskCompleteSound={playTaskCompleteSound}
                      playReminderSound={playReminderSound}
                    />
                  </div>
                ))
              )}
            </AnimatePresence>

            {/* Delete All Button */}
            {tasks.length > 0 && (
              <Row justify="center" style={{ marginTop: isMobile ? 16 : 20 }}>
                <Col span={isMobile ? 24 : undefined}>
                  <Button 
                    danger
                    size={isMobile ? 'middle' : 'large'}
                    onClick={showDeleteAllConfirm}
                    style={{ 
                      borderRadius: '8px',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    Delete All Tasks
                  </Button>
                </Col>
              </Row>
            )}
          </Card>
        </motion.div>
      </Content>

      {/* Removed floating voice button for mobile */}
    </Layout>
  );
}

export default App;