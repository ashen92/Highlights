import { useAppContext } from "@/features/account/AppContext";
import React, { useEffect, useState } from 'react';
import { FaRegThumbsUp, FaRegThumbsDown } from 'react-icons/fa';
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
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <button className={styles.closeButton} onClick={handleClose}>
                        &times; {/* HTML entity for the cross icon */}
                    </button>
                    <h3>Tip of the Day..</h3>
                    <h2>{tip}</h2>

                    <div className={styles.buttonsLinkContainer}>
                        {/* Link */}
                        <div className={styles.linkContainer}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleFormPopup(); }} rel="noopener noreferrer">
                                Get Personalised Tips..
                            </a>
                        </div>

                        {/* Feedback Buttons Container */}
                        <div className={styles.feedbackButtons}>
                            <h5 className={styles.feedbackQuestion}>Was this tip useful?</h5>
                            <div className={styles.buttonsRow}>
                                <button className={styles.usefulButton} onClick={() => handleFeedback(true)}>
                                    <FaRegThumbsUp />
                                </button>
                                <button className={styles.notUsefulButton} onClick={() => handleFeedback(false)}>
                                    <FaRegThumbsDown />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* {feedback && <p>Thanks for your feedback: {feedback}</p>} */}

            {/* Form Popup */}
            {isFormPopupOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButton} onClick={toggleFormPopup}>&times;</button>
                        <h3>Select Preferred Labels</h3>

                        <form onSubmit={handleFormSubmit} className={styles.labelForm}>
                            {predefinedLabels.map(label => (
                                <div key={label} className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        id={label}
                                        name="labels"
                                        value={label}
                                        checked={selectedLabel.includes(label)}
                                        onChange={() => handleCheckboxChange(label)}
                                    />
                                    <label htmlFor={label}>{label}</label>
                                </div>
                            ))}
                            <button type="submit" className={styles.submitButton}>Submit</button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};