import type React from "react";

/**
 * Creates a watcher for the user's location.
 * @param setUserLocation
 */
export default function createUserLocationWatcher(
    setUserLocation: React.Dispatch<
        React.SetStateAction<{ lat: number; lng: number }>
    >
) {
    if (!("geolocation" in navigator)) {
        console.error("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.watchPosition(
        (position) => {
            setUserLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        },
        (error) => {
            console.log("Error watching position:", error);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000
        }
    );
}
