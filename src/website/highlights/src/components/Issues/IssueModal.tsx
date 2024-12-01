import { useAppContext } from "@/features/account/AppContext";
import { Modal, TextInput, Textarea, Button } from "@mantine/core";
import { useState } from "react";
import { submitIssue } from "@/services/api";

interface IssueModalProps {
  opened: boolean;
  onClose: () => void;
}

const IssueModal: React.FC<IssueModalProps> = ({ opened, onClose }) => {
  const { user } = useAppContext();  // Get the user context
  const [formState, setFormState] = useState({
    title: "",
    description: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

  const handleSubmit = async () => {
    // Validate form fields
    if (!formState.title || !formState.description) {
      setErrors({
        title: !formState.title ? "Title is required" : "",
        description: !formState.description ? "Description is required" : "",
      });
      return;
    }
  
    try {
      // Convert user.id to number before submitting
      const userId = Number(user.id);
  
      if (user && !isNaN(userId)) {
        await submitIssue(
          {
            title: formState.title,
            description: formState.description,
            userId, // Pass the userId as number
          },
          user
        );
        console.log("Issue created successfully:", formState);
        onClose(); // Close modal on successful submission
      } else {
        console.error("User information is missing or user ID is invalid");
      }
    } catch (error) {
      console.error("Failed to create issue:", error);
      // Display error feedback if needed
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
