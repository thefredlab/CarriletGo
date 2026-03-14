import { useEffect, useState } from "react";

type WindowSize = {
    width: number | undefined;
    height: number | undefined;
};

/**
 * Custom React Hook that tracks the window size and updates state whenever the window is resized.
 *
 * This hook initializes the window size with undefined width and height to ensure consistency between server-side
 * and client-side rendering. It adds an event listener to update the dimensions whenever the window is resized
 * and cleans up the event listener when the component is unmounted.
 *
 * @return {WindowSize} An object containing the current window width and height.
 */
export default function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: undefined,
        height: undefined
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        }

        window.addEventListener("resize", handleResize);

        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}
