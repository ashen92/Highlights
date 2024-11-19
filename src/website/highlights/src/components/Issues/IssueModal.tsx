import { AppUser, useAppUser } from '@/hooks/useAppUser';
import { Modal, TextInput, Textarea, Button } from '@mantine/core';
import { useState } from 'react';
import { submitIssue } from '@/services/api';

interface IssueModalProps {
  opened: boolean;
  onClose: () => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ opened, onClose }) => {
  const { user } = useAppUser();
  const [formState, setFormState] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const handleSubmit = async () => {
    // Validate form fields
    if (!formState.title || !formState.description) {
      setErrors({
        title: !formState.title ? 'Title is required' : '',
        description: !formState.description ? 'Description is required' : '',
      });
      return;
    }

    try {
      // Submit to backend using the imported createIssue function
      await submitIssue(formState,user as any);
      console.log('Issue created successfully:', formState);
      onClose(); // Close modal on submit
    } catch (error) {
      console.error('Failed to create issue:', error);
      // Handle API errors if necessary
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Report Issue">
      <TextInput
        label="Title"
        placeholder="Enter issue title"
        required
        withAsterisk
        value={formState.title}
        onChange={(e) =>
          setFormState((prevState) => ({
            ...prevState,
            title: e.target.value,
          }))
        }
        error={errors.title}
      />
      <Textarea
        label="Description"
        placeholder="Enter issue description"
        required
        withAsterisk
        minRows={4}
        resize="vertical"
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
      <Button fullWidth mt="md" onClick={handleSubmit}>
        Submit
      </Button>
    </Modal>
  );
};

export default IssueModal;
