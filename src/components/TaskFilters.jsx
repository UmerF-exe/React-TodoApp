import React from 'react';
import { 
  Row, 
  Col, 
  Input, 
  Select, 
  Radio,
  Space,
  Badge,
  Button,
  Drawer
} from 'antd';
import { 
  SearchOutlined,
  SortAscendingOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useState } from 'react';

const { Option } = Select;

const TaskFilters = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterPriority,
  setFilterPriority,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  categories,
  priorities,
  isMobile
}) => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  const FilterContent = () => (
    <Space direction="vertical" style={{ width: '100%' }} size={isMobile ? 12 : 16}>
      {/* Category Filter */}
      <Select
        style={{ width: '100%' }}
        placeholder="Category"
        value={filterCategory}
        onChange={setFilterCategory}
        allowClear
        size={isMobile ? 'middle' : 'large'}
      >
        <Option value="all">All Categories</Option>
        {categories.map(cat => (
          <Option key={cat.value} value={cat.value}>
            <Badge color={cat.color} /> {cat.label}
          </Option>
        ))}
      </Select>

      {/* Priority Filter */}
      <Select
        style={{ width: '100%' }}
        placeholder="Priority"
        value={filterPriority}
        onChange={setFilterPriority}
        allowClear
        size={isMobile ? 'middle' : 'large'}
      >
        <Option value="all">All Priorities</Option>
        {priorities.map(p => (
          <Option key={p.value} value={p.value}>
            <Badge color={p.color} /> {p.label}
          </Option>
        ))}
      </Select>

      {/* Status Filter */}
      <Select
        style={{ width: '100%' }}
        placeholder="Status"
        value={filterStatus}
        onChange={setFilterStatus}
        allowClear
        size={isMobile ? 'middle' : 'large'}
      >
        <Option value="all">All Tasks</Option>
        <Option value="active">Active</Option>
        <Option value="completed">Completed</Option>
      </Select>

      {/* Sort By */}
      <Select
        style={{ width: '100%' }}
        placeholder="Sort by"
        value={sortBy}
        onChange={setSortBy}
        suffixIcon={<SortAscendingOutlined />}
        size={isMobile ? 'middle' : 'large'}
      >
        <Option value="createdAt">Date Created</Option>
        <Option value="dueDate">Due Date</Option>
        <Option value="priority">Priority</Option>
        <Option value="category">Category</Option>
      </Select>

      {/* Quick Status Filters */}
      {!isMobile && (
        <Radio.Group 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          buttonStyle="solid"
          size="middle"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="active">Active</Radio.Button>
          <Radio.Button value="completed">Completed</Radio.Button>
        </Radio.Group>
      )}
    </Space>
  );

  return (
    <Space direction="vertical" style={{ width: '100%', marginBottom: isMobile ? 16 : 24 }}>
      {/* Search bar */}
      <Input
        placeholder={isMobile ? "Search..." : "Search tasks..."}
        prefix={<SearchOutlined />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        allowClear
        size={isMobile ? 'middle' : 'large'}
      />

      {/* Mobile filter button */}
      {isMobile ? (
        <>
          <Button 
            block
            icon={<FilterOutlined />}
            onClick={() => setFilterDrawerVisible(true)}
            size="middle"
          >
            Filters & Sort
          </Button>
          
          <Drawer
            title="Filters & Sort"
            placement="bottom"
            onClose={() => setFilterDrawerVisible(false)}
            open={filterDrawerVisible}
            height="auto"
            style={{ maxHeight: '80vh' }}
          >
            <FilterContent />
            <Button 
              type="primary" 
              block 
              style={{ marginTop: 16 }}
              onClick={() => setFilterDrawerVisible(false)}
            >
              Apply Filters
            </Button>
          </Drawer>
        </>
      ) : (
        // Desktop filters row
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Category"
              value={filterCategory}
              onChange={setFilterCategory}
              allowClear
              size="large"
            >
              <Option value="all">All Categories</Option>
              {categories.map(cat => (
                <Option key={cat.value} value={cat.value}>
                  <Badge color={cat.color} /> {cat.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Priority"
              value={filterPriority}
              onChange={setFilterPriority}
              allowClear
              size="large"
            >
              <Option value="all">All Priorities</Option>
              {priorities.map(p => (
                <Option key={p.value} value={p.value}>
                  <Badge color={p.color} /> {p.label}
                </Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Status"
              value={filterStatus}
              onChange={setFilterStatus}
              allowClear
              size="large"
            >
              <Option value="all">All Tasks</Option>
              <Option value="active">Active</Option>
              <Option value="completed">Completed</Option>
            </Select>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Select
              style={{ width: '100%' }}
              placeholder="Sort by"
              value={sortBy}
              onChange={setSortBy}
              suffixIcon={<SortAscendingOutlined />}
              size="large"
            >
              <Option value="createdAt">Date Created</Option>
              <Option value="dueDate">Due Date</Option>
              <Option value="priority">Priority</Option>
              <Option value="category">Category</Option>
            </Select>
          </Col>
        </Row>
      )}
    </Space>
  );
};

export default TaskFilters;