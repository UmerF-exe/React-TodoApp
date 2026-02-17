import React from 'react';
import { Row, Col, Card, Statistic, Progress } from 'antd';
import { 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  TagOutlined,
  RocketOutlined 
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import useWindowSize from '../hooks/useWindowSize';

const TaskStats = ({ tasks, categories }) => {
  const windowSize = useWindowSize();
  const isMobile = windowSize.width < 550;

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? (completed / total) * 100 : 0;

  // Category statistics
  const categoryStats = categories.map(cat => ({
    ...cat,
    count: tasks.filter(t => t.category === cat.value).length,
    completed: tasks.filter(t => t.category === cat.value && t.completed).length
  }));

  // Priority statistics
  const highPriority = tasks.filter(t => t.priority === 'high' && !t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px' : '16px' }}>
            <Statistic
              title="Total Tasks"
              value={total}
              prefix={<TagOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: isMobile ? '20px' : '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px' : '16px' }}>
            <Statistic
              title="Completed"
              value={completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a', fontSize: isMobile ? '20px' : '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px' : '16px' }}>
            <Statistic
              title="Pending"
              value={pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14', fontSize: isMobile ? '20px' : '24px' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" bodyStyle={{ padding: isMobile ? '12px' : '16px' }}>
            <Statistic
              title="High Priority"
              value={highPriority}
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#ff4d4f', fontSize: isMobile ? '20px' : '24px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <Card size="small" title="Overall Progress" bodyStyle={{ padding: isMobile ? '12px' : '16px' }}>
            <Progress 
              percent={Math.round(completionRate)} 
              status={completionRate === 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              size={isMobile ? 'small' : 'default'}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card size="small" title="Category Breakdown" bodyStyle={{ padding: isMobile ? '12px' : '16px' }}>
            <Row gutter={[8, 8]}>
              {categoryStats.map(cat => (
                <Col span={24} key={cat.value}>
                  <Row justify="space-between" align="middle">
                    <Col span={10}>
                      <span style={{ color: cat.color }}>●</span> {cat.label}
                    </Col>
                    <Col span={14}>
                      <Progress 
                        percent={cat.count > 0 ? Math.round((cat.completed / cat.count) * 100) : 0}
                        size="small"
                        showInfo={false}
                        strokeColor={cat.color}
                        style={{ width: isMobile ? 80 : 100 }}
                      />
                      <span style={{ marginLeft: 8, fontSize: isMobile ? '12px' : '14px' }}>
                        {cat.completed}/{cat.count}
                      </span>
                    </Col>
                  </Row>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </motion.div>
  );
};

export default TaskStats;