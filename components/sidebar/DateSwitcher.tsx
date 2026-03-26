import { Dispatch, SetStateAction, RefObject, useEffect, useRef, useState } from "react";
import useWindowSize from "@/utils/useWindowSize";

import styles from "./DateSwitcher.module.css";

export default function DateSwitcher({activeDate, setActiveDate}: {
    activeDate: Date | undefined,
    setActiveDate: Dispatch<SetStateAction<Date | undefined>>
}) {
    const windowSize = useWindowSize();

    const [activeOption, setActiveOption] = useState<RefObject<HTMLDivElement | null>>();

    const nowRef = useRef<HTMLDivElement>(null),
        customRef = useRef<HTMLDivElement>(null),
        backgroundRef = useRef<HTMLDivElement>(null),
        datePickerRef = useRef<HTMLInputElement>(null);

    const toLocalDateTimeInputValue = (date: Date) => {
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
    };

    // Background animation
    useEffect(() => {
        if (!activeOption?.current || !backgroundRef.current || !datePickerRef.current) return;

        const oldOption = activeOption.current === nowRef.current ? customRef.current : nowRef.current,
            active = activeOption.current,
            background = backgroundRef.current,
            datePicker = datePickerRef.current;

        if (!oldOption) return;

        if (activeOption === nowRef) setActiveDate(undefined);
        else if (datePicker.value && !activeDate) setActiveDate(new Date(datePicker.value));

        background.animate([
            {left: `${oldOption.offsetLeft}px`},
            {left: `${active.offsetLeft}px`}
        ], {
            duration: 200,
            easing: 'ease-in-out'
        });

        background.style.left = `${active.offsetLeft}px`;
    }, [activeDate, activeOption, setActiveDate, windowSize]);

    return <>
        <div className={styles.dateSwitcher}>
            <div className={styles.background} ref={backgroundRef}></div>

            <div className={styles.option} onClick={() => setActiveOption(nowRef)} ref={nowRef}>
                Now
            </div>
            <div className={styles.option} onClick={() => setActiveOption(customRef)} ref={customRef}>
                <input type="datetime-local"
                       className={[styles.datePicker, activeOption === customRef ? styles.active : ""].join(" ")}
                       onChange={(e) => setActiveDate(new Date(e.target.value))}
                       defaultValue={toLocalDateTimeInputValue(activeDate ?? new Date())}
                       ref={datePickerRef}
                />
                <span>Custom</span>
            </div>
        </div>
    </>;
}