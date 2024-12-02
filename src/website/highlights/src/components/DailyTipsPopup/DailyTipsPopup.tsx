import { useAppContext } from "@/features/account/AppContext";
import React, { useEffect, useState } from 'react';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
import { Modal, Button, Checkbox, Text, Group, Stack } from "@mantine/core";
import styles from './DailyTipsPopup.module.css';
import { getRandomTip, savePreferences, sendFeedback } from '@/services/api';

const predefinedLabels = [
    'Urgent', 'Important', 'Quick Wins', 'High Priority', 'Low Priority',
    'Daily Goals', 'Focus', 'Mindfulness', 'Work', 'Personal'
];

export default function DailyTipsPopup() {
    const { user } = useAppContext();
    const [isOpen, setIsOpen] = useState(true); // Popup initially open
    const [tip, setTip] = useState<string>('Fetching tip...');
    const [tipId, setTipId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null); // To store feedback
    const [isFormPopupOpen, setIsFormPopupOpen] = useState(false); // Form popup visibility
    const [selectedLabel, setSelectedLabel] = useState<string[]>([]); // State for selected label

    // Fetch the random tip from the backend
    const fetchRandomTip = async () => {
        try {
            const userId = Number(user.id)
            const randomTip = await getRandomTip(userId);
            setTip(randomTip.tip);  // Assuming the response is in the format { tip: "random tip" }
            setTipId(randomTip.id);
        } catch (error) {
            console.error('Error fetching the tip:', error);
            setTip('Error fetching the tip.');
        }
    };

    // Fetch a tip when the component loads (popup opens)
    useEffect(() => {
        if (isOpen) {
            fetchRandomTip();
        }
    }, [isOpen]);

    // Function to close the modal
    const handleClose = () => {
        setIsOpen(false);
    };

    // Function to handle feedback
    const handleFeedback = async (isUseful: boolean) => {
        setFeedback(isUseful ? 'Useful' : 'Not Useful');
        // setIsOpen(false);
        // console.log(`User found the tip ${isUseful ? 'Useful' : 'Not Useful'}`);

        if (tipId !== null) {
            try {
                await sendFeedback({ tipId, isUseful });
                // console.log("Feedback sent successfullly");
            } catch (error) {
                console.error('Error sending feedback: ', error);
            }
        }
    };

    // Open and close form popup
    const toggleFormPopup = () => {
        setIsFormPopupOpen(!isFormPopupOpen);
    };

    const handleCheckboxChange = (label: string) => {
        setSelectedLabel(prevSelected =>
            prevSelected.includes(label)
                ? prevSelected.filter(item => item !== label)
                : [...prevSelected, label]
        );
    };


    // Handle form submission
    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!user?.id) {
            console.error("User is not logged in.");
            return;
        }

        if (selectedLabel.length === 0) {
            // console.log("No labels selected.");
            return;
        }

        console.log("Payload to be sent to backend:", {
            user_id: Number(user.id),
            labels: selectedLabel,
        });

        try {
            await savePreferences({
                user_id: Number(user.id),
                labels: selectedLabel,
            });
            setIsFormPopupOpen(false); // Close the form popup
            setSelectedLabel([]); // Clear selected labels after successful submission
        } catch (error) {
            console.error("Error saving preferences:", error);
        }
    };

    if (!isOpen) return null; // Don't render modal if not open

    return (
        <>
            {/* Main Tip Popup */}
            <Modal
                opened={isOpen}
                onClose={handleClose}
                title="Tip of the Day.."
                centered
                size="md"
            >
                <Text size="xl">
                    {tip}
                </Text>

                <Group mt="md">
                    <Button variant="outline" onClick={toggleFormPopup}>
                        Get Preferred Tips
                    </Button>

                    <Group >
                        <Text size="sm" mt="xs">Was this tip useful?</Text>
                        <Button
                            color="green"
                            onClick={() => handleFeedback(true)}
                            size="sm"
                            variant="outline"
                        >
                            <FaRegThumbsUp />
                        </Button>
                        <Button
                            color="red"
                            onClick={() => handleFeedback(false)}
                            size="sm"
                            variant="outline"
                        >
                            <FaRegThumbsDown />
                        </Button>
                    </Group>
                </Group>
            </Modal>


            {/* Form Popup for Preferences */}
            <Modal
                opened={isFormPopupOpen}
                onClose={toggleFormPopup}
                title="Select Preferred Labels"
                centered
                size="sm"
            >
                <form onSubmit={handleFormSubmit}>
                    <Stack>
                        {predefinedLabels.map((label) => (
                            <Checkbox
                                key={label}
                                label={label}
                                checked={selectedLabel.includes(label)}
                                onChange={() => handleCheckboxChange(label)}
                            />
                        ))}
                    </Stack>
                    <Group mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
};
