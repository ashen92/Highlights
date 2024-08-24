import React, { useState, useRef, useEffect } from 'react';
import { Modal, TextInput, Button, Textarea, Select, ActionIcon, rem, Text } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { IconClock, IconX } from '@tabler/icons-react';
import { updateTask as updateApiTask } from '@/services/api';

interface UpdateTaskPopupProps {
  open: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate: (updatedTask: Task) => void;
}

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

interface ApiTask {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  startTime: string;
  endTime: string;
  label: string;
  reminder: string;
  priority: string;
}

const UpdateTaskPopup: React.FC<UpdateTaskPopupProps> = ({ open, onClose, task, onUpdate }) => {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    label: '',
    reminder: '',
    priority: '',
  });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setFormState({
        title: task.title,
        description: task.description,
        label: task.label,
        reminder: task.reminder,
        priority: task.priority,
      });
      setDueDate(task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate as any));
      setStartTime(task.startTime);
      setEndTime(task.endTime);
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!formState.title) newErrors.title = 'Title is required';
    if (!formState.description) newErrors.description = 'Description is required';
    if (!dueDate) newErrors.dueDate = 'Due date is required';
    if (!startTime) newErrors.startTime = 'Start time is required';
    if (!endTime) newErrors.endTime = 'End time is required';
    if (startTime && endTime && new Date(`1970-01-01T${startTime}Z`).getTime() >= new Date(`1970-01-01T${endTime}Z`).getTime()) {
      newErrors.time = 'Start time should be less than end time';
    }
    if (dueDate instanceof Date && dueDate.getTime() < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date should be today or a future date';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const adjustedDueDate = dueDate ? new Date(Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())) : null;

    const updatedTask: Task = {
      ...task!,
      title: formState.title,
      description: formState.description,
      dueDate: adjustedDueDate,
      startTime: startTime,
      endTime: endTime,
      label: formState.label,
      reminder: formState.reminder,
      priority: formState.priority,
    };

    const apiTask: ApiTask = {
      ...updatedTask,
      dueDate: updatedTask.dueDate ? updatedTask.dueDate.toISOString() : null,
      startTime: updatedTask.startTime,
      endTime: updatedTask.endTime,
    };

    console.log('Updated Task:', updatedTask);
    console.log('API Task:', apiTask);

    try {
      await updateApiTask(apiTask as any);
      onUpdate(updatedTask);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const pickerControl = (ref: React.RefObject<HTMLInputElement>) => (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const handleSelectChange = (value: string | null) => {
    setFormState((prevState) => ({
      ...prevState,
      reminder: value || '',
    }));
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Update Task"
      closeButtonProps={{
        icon: <IconX size={20} stroke={1.5} />,
      }}
      centered
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          withAsterisk
          label="Title"
          name="title"
          value={formState.title}
          onChange={(e) =>
            setFormState((prevState) => ({
              ...prevState,
              title: e.target.value,
            }))
          }
          error={errors.title}
        />

        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <DatePicker value={dueDate} onChange={setDueDate} minDate={new Date()} />
          {errors.dueDate && <Text color="red">{errors.dueDate}</Text>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: rem(10) }}>
          <TimeInput
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.currentTarget.value)}
            ref={startRef}
            rightSection={pickerControl(startRef)}
            style={{ width: '180px' }}
            error={errors.startTime}
          />
          <TimeInput
            label="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.currentTarget.value)}
            ref={endRef}
            rightSection={pickerControl(endRef)}
            style={{ width: '180px' }}
            error={errors.endTime || errors.time}
          />
        </div>

        <Select
          label="Label"
          placeholder="Pick value"
          name="label"
          value={formState.label}
          onChange={(value) =>
            setFormState((prevState) => ({
              ...prevState,
              label: value || '',
            }))
          }
          data={['Reading', 'Writing', 'Homework', 'Schoolwork', 'Shopping'].map((value) => ({ value, label: value }))}
          searchable
        />

        <Select
          label="Reminder"
          placeholder="Pick value"
          name="reminder"
          value={formState.reminder}
          onChange={handleSelectChange}
          data={[
            'Before 10 minutes',
            'Before 15 minutes',
            'Before 20 minutes',
            'Before 30 minutes',
          ].map((value) => ({ value, label: value }))}
          mb="md"
          error={errors.reminder}
        />

        <Select
          label="Priority"
          placeholder="Pick value"
          name="priority"
          value={formState.priority}
          onChange={(value) =>
            setFormState((prevState) => ({
              ...prevState,
              priority: value || '',
            }))
          }
          data={[
            { value: 'none', label: 'None' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          mb="md"
          error={errors.priority}
        />

        <Textarea
          resize="vertical"
          label="Description"
          name="description"
          value={formState.description}
          onChange={(e) =>
            setFormState((prevState) => ({
              ...prevState,
              description: e.target.value,
            }))
          }
          mb="md"
          error={errors.description}
        />

        <Button type="submit">Update</Button>
      </form>
    </Modal>
  );
};

export default UpdateTaskPopup;
