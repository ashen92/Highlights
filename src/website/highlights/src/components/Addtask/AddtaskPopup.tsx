import React, { useState, useRef } from 'react';
import { Modal, TextInput, Button, Textarea, Select, ActionIcon, rem } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import { IconClock, IconX } from '@tabler/icons-react';

interface AddtaskPopupProps {
  open: boolean;
  onClose: () => void;
  addTask: (newTask: any) => void;
}

export default function Addtask_popup({ open, onClose, addTask }: AddtaskPopupProps) {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    reminder: '',
    priority: '',
  });
  const [value, setValue] = useState<Date | null>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newTask = {
      id: Date.now(), // Example: Use a unique identifier like timestamp
      title: formState.title,
      description: formState.description,
      date: value?.toISOString().split('T')[0], // Example: Convert date to string format
      subTasks: [], // Example: Initialize subTasks array
    };
    addTask(newTask); // Call parent function to add the new task
    onClose(); // Close modal after submission
  };

  const pickerControl = (ref: React.RefObject<HTMLInputElement>) => (
    <ActionIcon variant="subtle" color="gray" onClick={() => ref.current?.showPicker()}>
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  const handleSelectChange = (value: string | null, option: { label: string, value: string }) => {
    setFormState(prevState => ({
      ...prevState,
      reminder: value || '', // Update state with selected value or empty string if null
    }));
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Task Details"
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
          onChange={(e) => setFormState(prevState => ({
            ...prevState,
            title: e.target.value,
          }))}
        />

        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
          <DatePicker value={value} onChange={setValue} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: rem(10) }}>
          <TimeInput
            label="Start Time"
            ref={startRef}
            rightSection={pickerControl(startRef)}
            style={{ width: '180px' }}
          />
          <TimeInput
            label="End Time"
            ref={endRef}
            rightSection={pickerControl(endRef)}
            style={{ width: '180px' }}
          />
        </div>

        <Select
          label="Reminder"
          placeholder="Pick value"
          name="reminder"
          value={formState.reminder}
          onChange={handleSelectChange} // Use the adapted onChange handler
          data={['Before 10 minutes', 'Before 15 minutes', 'Before 20 minutes', 'Before 30 minutes'].map(value => ({ value, label: value }))}
          mb="md"
        />

        <Select
          label="Priority"
          placeholder="Pick value"
          name="priority"
          value={formState.priority}
          onChange={(value) => setFormState(prevState => ({
            ...prevState,
            priority: value || '',
          }))}
          data={[
            { value: 'none', label: 'None' },
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ]}
          mb="md"
        />

        <Textarea
          resize="vertical"
          label="Description"
          name="description"
          value={formState.description}
          onChange={(e) => setFormState(prevState => ({
            ...prevState,
            description: e.target.value,
          }))}
          mb="md"
        />

        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
}
