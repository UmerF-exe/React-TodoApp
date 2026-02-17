import React from 'react';
import { Card, Row, Col, Button, Tooltip } from 'antd';
import { 
  RocketOutlined, 
  ShoppingOutlined,
  TeamOutlined,
  BookOutlined,
  CoffeeOutlined
} from '@ant-design/icons';

const TaskTemplates = ({ onLoadTemplate, isMobile }) => {
  const templates = [
    { 
      name: 'Daily Routine', 
      icon: <CoffeeOutlined />, 
      color: '#1890ff',
      description: 'Start your day right'
    },
    { 
      name: 'Shopping', 
      icon: <ShoppingOutlined />, 
      color: '#52c41a',
      description: 'Grocery and shopping list'
    },
    { 
      name: 'Meeting', 
      icon: <TeamOutlined />, 
      color: '#722ed1',
      description: 'Meeting preparation tasks'
    },
    { 
      name: 'Study Session', 
      icon: <BookOutlined />, 
      color: '#fa8c16',
      description: 'Study and learning tasks'
    }
  ];

  return (
    <Card 
      size={isMobile ? 'small' : 'default'}
      title="Quick Templates" 
      style={{ marginBottom: isMobile ? 16 : 24 }}
      extra={<RocketOutlined />}
      bodyStyle={{ padding: isMobile ? '12px' : '16px' }}
    >
      <Row gutter={[isMobile ? 4 : 8, isMobile ? 4 : 8]}>
        {templates.map(template => (
          <Col xs={12} sm={6} key={template.name}>
            <Tooltip title={!isMobile ? template.description : ''}>
              <Button
                style={{ 
                  width: '100%',
                  height: isMobile ? '50px' : '60px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${template.color}10`,
                  borderColor: template.color,
                  color: template.color,
                  padding: isMobile ? '4px' : '8px'
                }}
                onClick={() => onLoadTemplate(template.name)}
              >
                <div style={{ fontSize: isMobile ? 16 : 20, marginBottom: isMobile ? 2 : 4 }}>
                  {template.icon}
                </div>
                <div style={{ fontSize: isMobile ? 10 : 12, textAlign: 'center' }}>
                  {isMobile ? template.name.split(' ')[0] : template.name}
                </div>
              </Button>
            </Tooltip>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default TaskTemplates;