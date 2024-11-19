import { useState } from "react";
import DailyTip from "@/components/DailytipPopup/DailytipPopup";

export default function Dailytip() {
    const [isOpen, setIsOpen] = useState(true); // Initially set to true to show the popup

    const handleClose = () => {
        setIsOpen(false); // Function to close the popup
    };

    return (
        <>
            <DailyTip 
                // tip={"AAAAAAAAAAAAAAA"} 
                // isOpen={isOpen} 
                // onClose={handleClose} 
            />
        </>
    );
}
