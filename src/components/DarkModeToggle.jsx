import React from 'react';
import { Switch } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const DarkModeToggle = ({ isDarkMode, setIsDarkMode, isMobile }) => {
  return (
    <Switch
      checked={isDarkMode}
      onChange={setIsDarkMode}
      checkedChildren={<BulbFilled />}
      unCheckedChildren={<BulbOutlined />}
      style={{
        background: isDarkMode ? '#ffd700' : '#001529',
        transform: isMobile ? 'scale(0.9)' : 'scale(1)'
      }}
      size={isMobile ? 'default' : 'default'}
    />
  );
};

export default DarkModeToggle;