import React, { useState } from 'react';
import { Modal, TextInput, Button, Textarea } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import { addTip } from '@/services/api';

interface AddDailyTipPopupProps {
  open: boolean;
  onClose: () => void;
}

const AddDailyTipPopup: React.FC<AddDailyTipPopupProps> = ({ open, onClose }) => {
  const [formState, setFormState] = useState<{ label: string; tip: string }>({ label: '', tip: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};
    if (!formState.label) newErrors.label = 'Label is required';
    if (!formState.tip) newErrors.tip = 'Tip is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // const newTip = {
    //   label: formState.label,
    //   tip: formState.tip, // Assuming 'text' is used in your Tip interface
    // };

    // try {
    //   await addTip(newTip);
    //   setFormState({ label: '', tip: '' });
    //   setErrors({});
    //   onClose();
    // } catch (error) {
    //   console.error('Error submitting tip:', error);
    // }
  };

  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Add Daily Tip"
      closeButtonProps={{
        icon: <IconX size={20} stroke={1.5} />,
      }}
      centered
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          withAsterisk
          label="Label"
          value={formState.label}
          onChange={(e) => setFormState(prevState => ({ ...prevState, label: e.target.value }))}
          error={errors.label}
        />
        <Textarea
          withAsterisk
          resize="vertical"
          label="Tip"
          value={formState.tip}
          onChange={(e) => setFormState(prevState => ({ ...prevState, tip: e.target.value }))}
          mb="md"
          error={errors.tip}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
};

export default AddDailyTipPopup;
