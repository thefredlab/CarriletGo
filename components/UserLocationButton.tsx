import createUserLocationWatcher from "@/components/map/createUserLocationWatcher";
import isCoordsInMapBounds from "@/utils/isCoordsInMapBounds";

import { Locate, LocateFixed, LocateOff } from "lucide-react";

import { useRef, useState, Dispatch, SetStateAction, useEffect } from "react";

import styles from "./UserLocationButton.module.css";

export default function UserLocationButton({ setUserLocation, userLocation }: {
    setUserLocation: Dispatch<SetStateAction<{ lat: number; lng: number }>>
    userLocation: { lat: number; lng: number }
}) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [watchID, setWatchID] = useState<number | undefined>();

    function handleClick() {
        if (watchID) {
            navigator.geolocation.clearWatch(watchID);
            setUserLocation({ lat: 0, lng: 0 });
            setWatchID(undefined);
        } else if (process.env.NODE_ENV === "development") {
            const coords = prompt("Which coords? Format: 'lat, lng'. Leave empty for default.");

            if (coords === null || coords === "") {
                setUserLocation({
                    lat: 42.11026734232309,
                    lng: 3.1427786229270978
                });

                setWatchID(80085);
            } else {
                const [lat, lng] = coords.split(",").map(Number);

                if (isNaN(lat) || isNaN(lng)) return alert(
                    "Invalid coordinates. Please enter valid latitude and longitude."
                );

                setUserLocation({ lat, lng });

                if (!isCoordsInMapBounds({ lat, lng })) {
                    setUserLocation({ lat: 0, lng: 0 });
                    alert("Coords are outside of bounds. Disabling location features. Setting userLocation to 0, 0");
                } else
                    setWatchID(80085);
            }
        } else {
            buttonRef.current?.classList.add(styles.searching);
            setWatchID(createUserLocationWatcher(setUserLocation, handleWatcherPermissionChange));
        }
    }

    function handleWatcherPermissionChange(permission: string) {
        if (permission !== "granted") setWatchID(undefined);
    }

    useEffect(() => {
        if (watchID) {
            if (userLocation.lat && userLocation.lng)
                buttonRef.current?.classList.remove(styles.searching);
            else
                buttonRef.current?.classList.add(styles.searching);
        } else
            buttonRef.current?.classList.remove(styles.searching);
    }, [userLocation, watchID]);

    return <div className={styles.button} onClick={handleClick} ref={buttonRef}>
        {watchID ?
            <>
                <Locate size={"2em"} strokeWidth={1.9} className={styles.locate} />
                <LocateFixed size={"2em"} strokeWidth={1.9} className={styles.locateFixed} />
            </> :
            <LocateOff size={"2em"} strokeWidth={1.9} />
        }
    </div>;
}