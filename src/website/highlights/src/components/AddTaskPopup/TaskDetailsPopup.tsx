import React from 'react';
import { Modal, Button, Text } from '@mantine/core';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  startTime: string;
  endTime: string;
  label: string;
  reminder: string;
  priority: string;
}

interface TaskDetailPopupProps {
  task: Task;
  opened: boolean;
  onClose: () => void;
}

const TaskDetailsPopup: React.FC<TaskDetailPopupProps> = ({ task, opened, onClose }) => {
  const formatDate = (date: Date | null) => {
    return date ? new Date(date).toDateString() : 'No due date';
  };

  const detailStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    padding: '5px 0'
  };

  const labelStyle = {
    color: '#4a90e2',
    fontWeight: 'bold'
  };

  const valueStyle = {
    color: '#333'
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text style={{ textAlign: 'center', marginLeft: '130px', fontWeight: 'bold' }}>Highlight Details</Text>}
      centered
    >
      <div style={{ padding: '20px' }}>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Title:</Text>
          <Text component="span" style={valueStyle}>{task.title}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Description:</Text>
          <Text component="span" style={valueStyle}>{task.description}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Due Date:</Text>
          <Text component="span" style={valueStyle}>{formatDate(task.dueDate)}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Start Time:</Text>
          <Text component="span" style={valueStyle}>{task.startTime}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>End Time:</Text>
          <Text component="span" style={valueStyle}>{task.endTime}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Label:</Text>
          <Text component="span" style={valueStyle}>{task.label}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Reminder:</Text>
          <Text component="span" style={valueStyle}>{task.reminder}</Text>
        </div>
        <div style={detailStyle}>
          <Text component="span" style={labelStyle}>Priority:</Text>
          <Text component="span" style={valueStyle}>{task.priority}</Text>
        </div>
      </div>
      <Button onClick={onClose} style={{ marginTop: '20px' }}>Close</Button>
    </Modal>
  );
};

export default TaskDetailsPopup;
