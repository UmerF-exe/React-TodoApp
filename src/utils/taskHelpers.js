import { message } from 'antd';
import moment from 'moment';

// Export tasks to JSON file
export const exportTasks = (tasks) => {
  const exportData = {
    tasks,
    exportDate: new Date().toISOString(),
    version: '1.0'
  };
  
  const dataStr = JSON.stringify(exportData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `tasks-backup-${moment().format('YYYY-MM-DD-HHmm')}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Import tasks from JSON file
export const importTasks = (file, callback) => {
  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Validate imported data
      if (importedData.tasks && Array.isArray(importedData.tasks)) {
        callback(importedData.tasks);
        message.success(`Successfully imported ${importedData.tasks.length} tasks`);
      } else {
        message.error('Invalid file format');
      }
    } catch (error) {
      message.error('Error parsing file');
      console.error('Import error:', error);
    }
  };
  
  reader.readAsText(file);
};