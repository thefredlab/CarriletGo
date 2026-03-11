import { Fragment } from "react";
import Image from "next/image";

import getLineByStopID from "@/data/getLineByStopID";
import getStopByID from "@/data/getStopByID";
import getDepartureTimesByStopID from "@/data/getDepartureTimesByStopID";

import styles from "@/components/sidebar/Sidebar.module.css";

export default function RouteStops({
    currentRoute,
    searchResults
}: {
    currentRoute: number[];
    searchResults: any[];
}) {
    return (
        <>
            {currentRoute.length > 0 &&
                searchResults.length === 0 &&
                currentRoute.map((stopID, index) => {
                    const currentStopLine = getLineByStopID(stopID, [
                            currentRoute[index - (index === 0 ? -1 : 1)]
                        ]),
                        nextStopLine = getLineByStopID(
                            currentRoute[index + 1],
                            [stopID]
                        );

                    const currentStop = getStopByID(stopID),
                        departureTimes = getDepartureTimesByStopID(
                            stopID,
                            currentStopLine?.lineID
                        );

                    return (
                        <Fragment
                            key={
                                stopID +
                                currentStop.location.lng +
                                currentStop.location.lat +
                                index
                            }
                        >
                            {(index === 0 ||
                                index === currentRoute.length - 1) && (
                                <div className={styles.routeStop}>
                                    <div className={styles.routeStopIcon}>
                                        <Image
                                            src={`/stops/${stopID}.png`}
                                            alt={stopID.toString()}
                                            width={30}
                                            height={30}
                                        />
                                    </div>

                                    <div className={styles.routeStopInfo}>
                                        <span>
                                            {index === 0
                                                ? "Enter at "
                                                : "Exit at "}
                                            <b>
                                                {currentStop?.customName ||
                                                    currentStop?.name ||
                                                    stopID.toString()}
                                            </b>
                                        </span>
                                    </div>

                                    {index === 0 && (
                                        <div
                                            className={
                                                styles.routeStopTimetable
                                            }
                                        >
                                            {departureTimes.formatted.length >
                                            0 ? (
                                                departureTimes.formatted
                                                    .slice(0, 6)
                                                    .map((time) => (
                                                        <span key={time}>
                                                            {time}
                                                        </span>
                                                    ))
                                            ) : (
                                                <span
                                                    style={{
                                                        flex: "100%"
                                                    }}
                                                >
                                                    No Departures available
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            {currentStopLine &&
                                nextStopLine &&
                                currentStopLine?.lineID !==
                                    nextStopLine?.lineID && (
                                    <div className={styles.routeStop}>
                                        <div className={styles.routeStopIcon}>
                                            <Image
                                                src={`/stops/${stopID}.png`}
                                                alt={stopID.toString()}
                                                width={30}
                                                height={30}
                                            />
                                        </div>

                                        <div className={styles.routeStopInfo}>
                                            <span>
                                                Transfer from{" "}
                                                <b>{currentStopLine?.name}</b>{" "}
                                                to <b>{nextStopLine?.name}</b>
                                                {" at "}
                                                <b>
                                                    {currentStop?.customName ||
                                                        currentStop?.name ||
                                                        stopID.toString()}
                                                </b>
                                            </span>
                                        </div>
                                    </div>
                                )}
                        </Fragment>
                    );
                })}
        </>
    );
}
