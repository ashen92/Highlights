import React, { useState, useRef, useEffect } from "react";
import { Modal, TextInput, Button, Textarea, Select, ActionIcon, rem, Text, Radio, } from "@mantine/core";
import { getTasktime } from "@/services/api";
import { DatePicker, TimeInput } from "@mantine/dates";
import { IconClock, IconX } from "@tabler/icons-react";
import { createTask as createApiTask, getEstimatedTime } from "@/services/api";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useAppContext } from "@/features/account/AppContext";


const MySwal = withReactContent(Swal);
interface AddtaskPopupProps {
  open: boolean;
  onClose: () => void;


}

interface Task {
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
  title: string;
  description: string;
  dueDate: string | null;
  startTime: string;
  endTime: string;
  label: string;
  reminder: string;
  priority: string;

}



export default function AddTaskPopup({ open, onClose }: AddtaskPopupProps) {
  const { user } = useAppContext();

  console.log(user);
  const priorityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336',
    none: 'F44336'
  };

  const [formState, setFormState] = useState({
    title: "",
    description: "",
    reminder: "",
    priority: "",
    label: "",
  });
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [blockedTimes, setBlockedTimes] = useState<{ start: string; end: string }[]>([]);
  // new
  const [isPopupShown, setIsPopupShown] = useState(false);
  console.log(dueDate);


  // Refs for accessing the TimeInput components' methods
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);






  useEffect(() => {
    const fetchTaskTimes = async () => {
      try {
        if (!dueDate) return;
        const taskTimes = await getTasktime(user,dueDate);
        // Example response structure
        const blockedSlots = taskTimes.map((task: any) => ({
          start: task.startTime,
          end: task.endTime,
        }));
        setBlockedTimes(blockedSlots);
      } catch (error) {
        console.error("Error fetching task times:", error);
      }
    };

    fetchTaskTimes();
  }, [dueDate, user]);

  const isTimeDisabled = (time: string) => {

    const today = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    const [month, day, year] = today.split(",")[0].split("/");
    const timeToCheck = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}:00+05:30`);

    return blockedTimes.some(slot => {

      const [slotStartDate, slotStartTime] = slot.start.split(" ");
      const [slotEndDate, slotEndTime] = slot.end.split(" ");
      const slotStart = new Date(`${slotStartDate}T${slotStartTime.replace(".0", "")}+05:30`);
      const slotEnd = new Date(`${slotEndDate}T${slotEndTime.replace(".0", "")}+05:30`);

      return timeToCheck >= slotStart && timeToCheck <= slotEnd;
    });
  };





  const handleTimeChange = (setter: React.Dispatch<React.SetStateAction<string>>, time: string, isStartTime: boolean) => {
    const today = new Date();
    const selectedDate = dueDate || today;  // Use dueDate or today's date if dueDate is not set

    // Extract hours and minutes from the selected time
    const [hours, minutes] = time.split(':').map(Number);
    const selectedTime = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), hours, minutes);

    // Prevent past times if the selected date is today
    if (selectedDate.toDateString() === today.toDateString() && selectedTime < today) {
      MySwal.fire({
        title: 'Invalid Time',
        text: 'You cannot select a past time.',
        icon: 'warning',
        confirmButtonText: 'Okay'
      });
      return;
    }

    // Check if the selected time is within a blocked time slot
    if (isTimeDisabled(time)) {
      MySwal.fire({
        title: 'Time Unavailable',
        text: 'The selected time slot is blocked. Please choose a different time.',
        icon: 'warning',
        confirmButtonText: 'Okay'
      });
      return;
    }

    setter(time);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    const newErrors: { [key: string]: string } = {};

    if (!formState.title) newErrors.title = "Title is required";
    if (!formState.description)
      newErrors.description = "Description is required";
    if (!dueDate) newErrors.dueDate = "Due date is required";
    if (!startTime) newErrors.startTime = "Start time is required";
    if (!endTime) newErrors.endTime = "End time is required";
    if (
      startTime &&
      endTime &&
      new Date(`1970-01-01T${startTime}Z`).getTime() >=
      new Date(`1970-01-01T${endTime}Z`).getTime()
    ) {
      newErrors.time = "Start time should be less than end time";
    }
    if (dueDate && dueDate.getTime() < new Date().setHours(0, 0, 0, 0))
      newErrors.dueDate = "Due date should be today or a future date";

    if (!formState.label) newErrors.label = "Label is required";
    if (!formState.reminder) newErrors.reminder = "Reminder is required";
    if (!formState.priority) newErrors.priority = "Priority is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Adjust dueDate to UTC
    const adjustedDueDate = dueDate
      ? new Date(
        Date.UTC(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate())
      )
      : null;

    // Constructing newTask object with form data
    const newTask: Task = {
      title: formState.title,
      description: formState.description,
      dueDate: adjustedDueDate,
      startTime: startTime,
      endTime: endTime,
      label: formState.label,
      reminder: formState.reminder,
      priority: formState.priority,

    };

    // Constructing apiTask object with data adjusted for API consumption
    const apiTask: ApiTask = {
      ...newTask,
      dueDate: newTask.dueDate ? newTask.dueDate.toISOString() : null,
      startTime: newTask.startTime,
      endTime: newTask.endTime,
      // subTasks: [],
    };

    // Logging newTask and apiTask for debugging purposes
    console.log("New Task:", newTask);
    console.log("API Task:", apiTask);



    try {
      const estimatedTime = await getEstimatedTime(apiTask);

      if (estimatedTime !== null && !isPopupShown) {
        MySwal.fire({
          title: 'Adjust Time',
          text: `We recommend an estimated time of ${estimatedTime} minutes. You can adjust your start and end time now.`,
          icon: 'info',
          showCancelButton: true,
          confirmButtonText: 'Adjust Time',
          cancelButtonText: 'Cancel',
        }).then(async (result) => {
          if (result.isConfirmed) {
            setIsPopupShown(true);
            // Keep the modal open for adjustments
            return; // Return to prevent closing the modal
          } else if (result.isDismissed) {
            setIsPopupShown(true);
            // User clicks 'Cancel', proceed with task creation
            await createApiTask(apiTask as any, user as any);
            setFormState({
              title: "",
              description: "",
              reminder: "",
              priority: "",
              label: "",
            });
            setDueDate(null);
            setStartTime("");
            setEndTime("");
            setErrors({});
            onClose();
          }
        });
      } else {
        // Create task directly if no estimated time is received
        await createApiTask(apiTask as any, user as any);
        setFormState({
          title: "",
          description: "",
          reminder: "",
          priority: "",
          label: "",
        });
        setDueDate(null);
        setStartTime("");
        setEndTime("");
        setErrors({});
        onClose();
      }
    } catch (error) {
      console.error("Error submitting task:", error);
    }
  };

  // Function to render clock icon and handle click event to show time picker
  const pickerControl = (ref: React.RefObject<HTMLInputElement>) => (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <IconClock style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
    </ActionIcon>
  );

  // Function to handle change in Select component for Reminder
  const handleSelectChange = (value: string | null) => {
    setFormState((prevState) => ({
      ...prevState,
      reminder: value || "",
    }));
  };

  // Rendering the modal component with form inputs
  return (
    <Modal
      opened={open}
      onClose={onClose}
      title="Highlight Details"
      closeButtonProps={{
        icon: <IconX size={20} stroke={1.5} />,
      }}
      centered
    >
      <form onSubmit={handleSubmit}>
        {/* TextInput component for Title */}
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

        {/* DatePicker component for Due Date */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "16px 0",
          }}
        >
          <DatePicker
            value={dueDate}
            onChange={setDueDate}
            minDate={new Date()} // Prevent selection of past dates
          />
          {errors.dueDate && <Text color="red">{errors.dueDate}</Text>}
        </div>

        {/* TimeInput components for Start Time and End Time */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: rem(10),
          }}
        >


          <TimeInput
            label="Start Time"
            value={startTime}
            onChange={(e) => handleTimeChange(setStartTime, e.currentTarget.value, true)}
            ref={startRef}
            rightSection={pickerControl(startRef)}
            style={{ width: "180px" }}
            error={errors.startTime}
          />
          <TimeInput
            label="End Time"
            value={endTime}
            onChange={(e) => handleTimeChange(setEndTime, e.currentTarget.value, false)}
            ref={endRef}
            rightSection={pickerControl(endRef)}
            style={{ width: "180px" }}
            error={errors.endTime || errors.time}
          />
        </div>

        <Select
          label="Enter the label"
          placeholder="Pick value"
          data={["Reading", "Writing", "Homework", "Schoolwork", "Shopping"]}
          searchable
          value={formState.label}
          onChange={(value) =>
            setFormState((prevState) => ({
              ...prevState,
              label: value || "",
            }))
          }
          error={errors.label}
        />

        {/* Select component for Reminder */}
        <Select
          label="Reminder"
          placeholder="Pick value"
          name="reminder"
          value={formState.reminder}
          onChange={handleSelectChange}
          data={[
            "Before 0 minutes",
            "Before 10 minutes",
            "Before 15 minutes",
            "Before 20 minutes",
            "Before 30 minutes",
          ].map((value) => ({ value, label: value }))}
          mb="md"
          error={errors.reminder}
        />

        {/* Select component for Priority */}
        {/* <Select
          label="Priority"
          placeholder="Pick value"
          name="priority"
          value={formState.priority}
          onChange={(value) =>
            setFormState((prevState) => ({
              ...prevState,
              priority: value || "",
            }))
          }
          data={[
            { value: "none", label: "None" },
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
          mb="md"
          error={errors.priority}
        /> */}
        <Radio.Group
  label="Priority"
  name="priority"
  value={formState.priority}
  onChange={(value) =>
    setFormState((prevState) => ({
      ...prevState,
      priority: value,
    }))
  }
  mb="md"
  error={errors.priority}
>
  <div style={{ display: "flex", gap: "1rem" }}> {/* Flexbox container */}
    <Radio value="none" label="None" />
    <Radio value="low" label="Low" />
    <Radio value="medium" label="Medium" />
    <Radio value="high" label="High" />
  </div>
</Radio.Group>




        {/* Textarea component for Description */}
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

        {/* Submit button */}
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
}