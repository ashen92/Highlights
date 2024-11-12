import React from 'react';
import { Button, Grid, TextInput, Modal } from '@mantine/core';
import { updateReview, changestatus, getTasks } from "@/services/api";
import { Task, Review } from "@/models/Task";
import { useAppContext } from '@/features/account/AppContext';
interface AlertDialogSlideProps {
  open: boolean;
  handleClose: (agree: boolean) => void;
  taskId: string;
}

const AlertDialogSlide: React.FC<AlertDialogSlideProps> = ({ open, handleClose, taskId }) => {
  const [formData, setFormData] = React.useState({
    q2: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const { user } = useAppContext();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {

      const review: Review = {
        id: taskId,
        description: formData.q2,
      };


      await updateReview(review);

      await changestatus(taskId);


      handleClose(true);

      const fetchedTasks = await getTasks(user as any);




    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <Modal
      opened={open}
      onClose={() => handleClose(false)}
      title="Task Completion Form"
      styles={{
        header: {
          backgroundColor: '#2196f3',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 'bold',
          fontSize: '1.5rem',
        },
        body: {
          padding: '20px',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Grid gutter="xs">
          <Grid.Col span={12}>
            <TextInput
              id="q2"
              name="q2"
              label="Briefly describe any issues"
              required
              value={formData.q2}
              onChange={handleInputChange}
              styles={{
                input: {
                  borderColor: '#1976d2',
                },
                label: {
                  color: '#1976d2',
                },
              }}
            />
          </Grid.Col>
        </Grid>
        <Button
          type="submit"
          style={{
            backgroundColor: '#2196f3',
            color: '#fff',
            marginTop: 3,
            marginLeft: 'auto',
            display: 'block',
          }}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default AlertDialogSlide;
