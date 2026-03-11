import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import styles from "./MapStyleSwitch.module.css";

/**
 *
 * @param setMapStyle
 * @constructor
 */
function MapStyleSwitch({
    setMapStyle
}: {
    setMapStyle: Dispatch<SetStateAction<string>>;
}) {
    const mapStyleBox = useRef<HTMLDivElement>(null),
        selectedBG = useRef<HTMLDivElement>(null),
        selectedBGBorder = useRef<HTMLDivElement>(null);

    const [activeOption, setActiveOption] = useState<string>("standard");

    const options = [
        { name: "Standard", value: "standard" },
        { name: "Satellite", value: "standard-satellite" }
    ];

    useEffect(() => {
        if (!mapStyleBox.current) return;

        const activeStyle = mapStyleBox.current.querySelector(
            `.${styles.active}`
        );

        if (activeStyle && selectedBG.current) {
            selectedBG.current.style.width = `${activeStyle.clientWidth}px`;

            const activeRect = activeStyle.getBoundingClientRect();
            const containerRect = mapStyleBox.current.getBoundingClientRect();

            const moveToX = activeRect.left - containerRect.left;

            selectedBG.current.style.transform = `translate(${moveToX}px, -50%)`;
        }

        mapStyleBox.current.addEventListener("mousemove", (e) => {
            if (!selectedBG.current || !selectedBGBorder.current) return;

            // get the element that the mouse is hovering over
            const mouseOverOption = document.elementFromPoint(
                e.clientX,
                e.clientY
            );

            if (
                mouseOverOption &&
                mouseOverOption.classList.contains(styles.mapStyle)
            ) {
                selectedBG.current.style.width = `${mouseOverOption.clientWidth}px`;
                selectedBGBorder.current.style.width = `${mouseOverOption.clientWidth}px`;
            }

            // Enable blur when moving around
            selectedBGBorder.current.style.backdropFilter = "";

            selectedBG.current.style.height = "120%";
            selectedBGBorder.current.style.height = "120%";

            // move inside the box
            const moveTo =
                e.clientX -
                mapStyleBox.current!.getBoundingClientRect().left -
                selectedBG.current!.clientWidth / 2;

            if (moveTo < 0)
                selectedBG.current.style.transform = `translate(0, -50%)`;
            else if (
                moveTo + selectedBG.current!.clientWidth >
                mapStyleBox.current!.clientWidth
            ) {
                selectedBG.current.style.transform = `translate(${
                    mapStyleBox.current!.clientWidth -
                    selectedBG.current!.clientWidth
                }px, -50%)`;
            } else {
                selectedBG.current.style.transform = `translate(${
                    e.clientX -
                    mapStyleBox.current!.getBoundingClientRect().left -
                    selectedBG.current!.clientWidth / 2
                }px, -50%)`;
            }

            selectedBGBorder.current.style.transform =
                selectedBG.current.style.transform;
        });

        mapStyleBox.current.addEventListener("mouseleave", () => {
            if (
                !mapStyleBox.current ||
                !selectedBG.current ||
                !selectedBGBorder.current
            )
                return;

            const activeStyle = mapStyleBox.current.querySelector(
                `.${styles.active}`
            );

            const smoothTransition = "all 0.3s ease-in-out",
                beforeTransition = selectedBG.current.style.transition;

            selectedBG.current.style.transition = smoothTransition;
            selectedBGBorder.current.style.transition = smoothTransition;

            if (activeStyle) {
                selectedBG.current.style.width = `${activeStyle.clientWidth}px`;

                // Center background on active option
                const activeRect = activeStyle.getBoundingClientRect();
                const containerRect =
                    mapStyleBox.current.getBoundingClientRect();
                const moveToX = activeRect.left - containerRect.left;

                selectedBG.current.style.transform = `translate(${moveToX}px, -50%)`;
            } else selectedBG.current.style.width = "0px";

            selectedBG.current.style.height = "calc(100% - 1em)";

            // Match border with background
            selectedBGBorder.current.style.height =
                selectedBG.current.style.height;

            selectedBGBorder.current.style.width =
                selectedBG.current.style.width;

            selectedBGBorder.current.style.transform =
                selectedBG.current.style.transform;

            selectedBGBorder.current.style.backdropFilter = "blur(0)";

            // Reset transition after it's done
            selectedBG.current.addEventListener(
                "transitionend",
                () => {
                    if (selectedBG.current)
                        selectedBG.current.style.transition = beforeTransition;
                },
                { once: true }
            );

            selectedBGBorder.current.addEventListener(
                "transitionend",
                () => {
                    if (selectedBGBorder.current)
                        selectedBGBorder.current.style.transition =
                            beforeTransition;
                },
                { once: true }
            );
        });
    }, [mapStyleBox]);

    function handleActiveOptionChange(
        e: React.MouseEvent<HTMLDivElement>,
        value: string
    ) {
        setActiveOption(value);
        setMapStyle(value);

        if (
            !selectedBG.current ||
            !selectedBGBorder.current ||
            !mapStyleBox.current
        )
            return;

        // Center background on active option
        const activeRect = e.currentTarget.getBoundingClientRect();
        const containerRect = mapStyleBox.current.getBoundingClientRect();
        const moveToX = activeRect.left - containerRect.left;

        selectedBG.current.style.transform = `translate(${moveToX}px, -50%)`;
        selectedBGBorder.current.style.transform =
            selectedBG.current.style.transform;

        // click animation: briefly decrease height and then return to normal
        selectedBG.current.style.height = "30%";
        selectedBGBorder.current.style.height = "30%";

        setTimeout(() => {
            if (selectedBG.current && selectedBGBorder.current) {
                selectedBG.current.style.height = "calc(100% - 1em)";
                selectedBGBorder.current.style.height = "calc(100% - 1em)";
            }
        }, 200);
    }

    return (
        <div className={styles.mapStyles} ref={mapStyleBox}>
            <div className={styles.selectedBG} ref={selectedBG}></div>
            <div
                className={styles.selectedBGBorder}
                ref={selectedBGBorder}
            ></div>

            {options.map((option) => (
                <div
                    key={option.value}
                    className={[
                        styles.mapStyle,
                        activeOption === option.value ? styles.active : ""
                    ].join(" ")}
                    onClick={(e) => handleActiveOptionChange(e, option.value)}
                >
                    {option.name}
                </div>
            ))}
        </div>
    );
}

export default MapStyleSwitch;
