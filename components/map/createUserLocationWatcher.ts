import isCoordsInMapBounds from "@/utils/isCoordsInMapBounds";

import type React from "react";

/**
 * Creates a watcher to track the user's location and updates the state with the current coordinates.
 * Optionally, notifies changes in location permission status.
 *
 * @param {React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>} setUserLocation - Function to update the user's location state with latitude and longitude.
 * @param {function(string): void} [onPermissionChange] - Optional callback invoked when the location permission state changes. Receives "granted", "denied", or "unavailable".
 * @return {number|void} Returns the ID of the geolocation watcher if supported, or `void` if geolocation is unavailable.
 */
export default function createUserLocationWatcher(
    setUserLocation: React.Dispatch<
        React.SetStateAction<{ lat: number; lng: number }>
    >,
    onPermissionChange?: (permissionState: string) => void
): number | undefined {
    if (!("geolocation" in navigator)) {
        console.error("Geolocation is not supported by your browser.");
        return;
    }

    let wasInBounds: boolean | undefined = true;

    return navigator.geolocation.watchPosition(
        (position) => {
            const isInBounds = isCoordsInMapBounds({ lat: position.coords.latitude, lng: position.coords.longitude });

            if (!isInBounds) {
                if (wasInBounds) alert("You're outside of our bounds. Please move near L'Escala to use this feature. To ensure a better experience we've deactivated location features until you're inside our bounds.\n\nTip: If the location icon top-right is blinking, your location is still being watched and the features will turn on automatically.");
                setUserLocation({ lat: 0, lng: 0 });
            } else {
                setUserLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }

            wasInBounds = isInBounds;
            onPermissionChange?.("granted");
        },
        (error) => {
            console.log("Error watching position:", error);
            if (error.code === error.PERMISSION_DENIED) {
                onPermissionChange?.("denied");
                alert(
                    "Location access is recommended for a better experience. Please allow location access in your browser settings."
                );
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                onPermissionChange?.("unavailable");
                console.log("Location information is unavailable.");
            } else if (error.code === error.TIMEOUT) {
                onPermissionChange?.("unavailable");
                console.log("The request to get user location timed out.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 5000
        }
    );
}
