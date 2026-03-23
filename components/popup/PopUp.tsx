import React, { useRef } from "react";
import { X } from "lucide-react";

import styles from "./PopUp.module.css";

/**
 * Renders a pop-up component with specified content and a close functionality.
 * The pop-up can be manually closed by clicking the close button.
 *
 * @param {Object} props - The properties to configure the pop-up component.
 * @param {React.ReactNode} props.content - The content to display inside the pop-up.
 * @param {React.Dispatch<React.SetStateAction<boolean>>} [props.popUpCloseRequest] - Optional function to handle the pop-up close request. If provided, it will be called with `true` when the pop-up is requested to close.
 * @return {JSX.Element} The rendered pop-up component.
 */
export default function PopUp({
    content,
    popUpCloseRequest
}: {
    content: React.ReactNode;
    popUpCloseRequest?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const popUpRef = useRef<HTMLDivElement>(null);

    function closePopup() {
        if (popUpCloseRequest) popUpCloseRequest(true);
        else popUpRef.current?.remove();
    }

    // check for ESCAPE key press
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closePopup();
    });

    return (
        <div className={styles.popupBackground} ref={popUpRef}>
            <div className={styles.popup}>
                <div className={styles.popupClose} onClick={closePopup}>
                    <X strokeWidth={3} />
                </div>
                {content}
            </div>
        </div>
    );
}
