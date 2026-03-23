import getDepartureTimesByStopID from "@/data/getDepartureTimesByStopID";
import getStopByID from "@/data/getStopByID";

import Image from "next/image";

import styles from "./StopInfoPopUp.module.css";

import type { Dispatch, SetStateAction } from "react";

export default function StopInfoPopUp({ stopID, setStart, setDestination }: {
    stopID: number;
    setStart?: Dispatch<SetStateAction<any>>,
    setDestination?: Dispatch<SetStateAction<any>>
}) {
    const stop = getStopByID(stopID),
        departures = getDepartureTimesByStopID(stopID);

    function setLocation(type: "start" | "destination") {
        if (!setStart || !setDestination) return;

        const set = type === "start" ? setStart : setDestination;

        set({
            name: stop.customName || stop.name,
            address: {},
            lat: stop.location.lat,
            lng: stop.location.lng
        });
    }

    return <>
        <header className={styles.heading}>
            <Image
                className={styles.stopIcon}
                src={`/stops/${stopID}.png`}
                alt={stopID.toString()}
                width={100}
                height={100}
            />
            <h2 className={styles.title}>
                {stop.name ?? stop.customName}
            </h2>
        </header>

        <h1 className={styles.timetableTitle}>
            Next Departures
        </h1>

        <div className={styles.timetable}>
            {departures && departures.formatted.length > 0 ? (
                departures.formatted.map((time, i) => (
                    <span
                        key={time + i}
                        className={styles.departure}
                    >
                                        {time}
                                    </span>
                ))
            ) : (
                <p className={styles.noTimetable}>
                    Sorry, we couldn&apos;t find any departures
                    for this stop. Please try again later.
                </p>
            )}
        </div>

        {setStart && setDestination && (
            <div className={styles.buttons}>
                <div
                    className={styles.button}
                    onClick={() => setLocation("start")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            setLocation("start");
                        }
                    }}
                    role={"button"}
                    tabIndex={0}
                >
                    Set as Start
                </div>

                <div
                    className={styles.button}
                    onClick={() => setLocation("destination")}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            setLocation("destination");
                        }
                    }}
                    role={"button"}
                    tabIndex={0}
                >
                    Set as Destination
                </div>
            </div>
        )}
    </>;
}