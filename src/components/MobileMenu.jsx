import React from 'react';
import { Drawer, Space, Button } from 'antd';
import { 
  UndoOutlined, 
  RedoOutlined, 
  ExportOutlined, 
  ImportOutlined,
  CloseOutlined,
  CalendarOutlined,
  BellOutlined
} from '@ant-design/icons';
import DarkModeToggle from './DarkModeToggle';

const MobileMenu = ({ 
  visible, 
  onClose, 
  isDarkMode, 
  setIsDarkMode,
  handleUndo,
  handleRedo,
  handleExport,
  handleImport,
  historyLength,
  redoStackLength,
  setShowCalendar,
  setShowReminders,
  showCalendar,
  showReminders
}) => {
  return (
    <Drawer
      title="Menu"
      placement="right"
      onClose={onClose}
      open={visible}
      width={280}
      closeIcon={<CloseOutlined />}
      style={{ background: isDarkMode ? '#1f1f1f' : '#fff' }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 8 }}>Theme</div>
          <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 8 }}>Views</div>
          <Button 
            block
            icon={<CalendarOutlined />} 
            onClick={() => { 
              setShowCalendar(!showCalendar); 
              onClose();
            }}
            type={showCalendar ? 'primary' : 'default'}
            size="large"
          >
            Calendar
          </Button>
          <Button 
            block
            icon={<BellOutlined />} 
            onClick={() => { 
              setShowReminders(!showReminders); 
              onClose();
            }}
            type={showReminders ? 'primary' : 'default'}
            size="large"
          >
            Reminders
          </Button>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 8 }}>Actions</div>
          <Button 
            block
            icon={<UndoOutlined />} 
            onClick={() => { handleUndo(); onClose(); }}
            disabled={historyLength === 0}
            size="large"
          >
            Undo
          </Button>
          <Button 
            block
            icon={<RedoOutlined />} 
            onClick={() => { handleRedo(); onClose(); }}
            disabled={redoStackLength === 0}
            size="large"
          >
            Redo
          </Button>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }}>
          <div style={{ marginBottom: 8 }}>Data</div>
          <Button 
            block
            icon={<ExportOutlined />} 
            onClick={() => { handleExport(); onClose(); }}
            size="large"
          >
            Export Tasks
          </Button>
          <Button 
            block
            icon={<ImportOutlined />} 
            onClick={() => { 
              document.getElementById('import-file-mobile').click(); 
              onClose();
            }}
            size="large"
          >
            Import Tasks
          </Button>
          <input
            type="file"
            id="import-file-mobile"
            style={{ display: 'none' }}
            accept=".json"
            onChange={handleImport}
          />
        </Space>
      </Space>
    </Drawer>
  );
};

export default MobileMenu;