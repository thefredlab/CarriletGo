import preCheckStopMarkerCollision from "@/components/map/preCheckStopMarkerCollision";
import getDepartureTimesByStopID from "@/data/getDepartureTimesByStopID";
import stops from "@/data/stops";

import mapboxgl from "mapbox-gl";
import Image from "next/image";

import styles from "./CreateStopMarkings.module.css";

import type { ReactNode, Dispatch } from "react";

/**
 * Creates stop markers on the map and attaches relevant event handlers for user interaction.
 *
 * @param {mapboxgl.Map} map - The Mapbox GL map instance where the stop markers will be rendered.
 * @param {Dispatch<React.SetStateAction<{name?: string, id?: number, content?: ReactNode}>>} [setSelectedStop] - Optional function to set the currently selected stop and its details.
 * @param {Dispatch<React.SetStateAction<any>>} [setStart] - Optional function to update the start location for a journey.
 * @param {Dispatch<React.SetStateAction<any>>} setDestination - Function to update the destination location for a journey.
 * @return {void} This function does not return a value but modifies the map instance by adding stop markers.
 */
export default function createStopMarkings(
    map: mapboxgl.Map,
    setSelectedStop?: Dispatch<
        React.SetStateAction<{
            name?: string;
            id?: number;
            content?: ReactNode;
        }>
    >,
    setStart?: Dispatch<React.SetStateAction<any>>,
    setDestination?: Dispatch<React.SetStateAction<any>>
) {
    const checkedStops = preCheckStopMarkerCollision(stops);

    for (let i = 1, len = Object.values(checkedStops).length; i <= len; i++) {
        const stop = checkedStops[i],
            stopID = `stop-${i}`;

        if (process.env.NODE_ENV === "development") {
            console.log(
                "[createStopMarkings]",
                `Adding stop marker for stop ID ${i} (${
                    stop.name ?? stop.customName
                }) at coordinates [${stop.location.lng}, ${stop.location.lat}]`
            );
        }

        map.addSource(stopID, {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [stop.location.lng, stop.location.lat]
                },
                properties: {
                    label: stop.name ?? stop.customName,
                    stopNo: i
                }
            }
        });

        const ele = document.createElement("div"),
            widthHeight = 30;

        ele.style.backgroundImage = `url("/stops/${i}.png")`;
        ele.style.width = `${widthHeight}px`;
        ele.style.height = `${widthHeight}px`;
        ele.style.backgroundSize = "contain";
        ele.style.backgroundRepeat = "no-repeat";

        ele.addEventListener("click", () => {
            map.flyTo({
                center: [stop.location.lng, stop.location.lat],
                essential: true
            });

            const departures = getDepartureTimesByStopID(i);

            setSelectedStop?.({
                name: stop.name ?? stop.customName,
                id: i,
                content: (
                    <>
                        <header className={styles.heading}>
                            <Image
                                className={styles.stopIcon}
                                src={`/stops/${i}.png`}
                                alt={i.toString()}
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
                                    Sorry, we couldn't find any departures for
                                    this stop. Please try again later.
                                </p>
                            )}
                        </div>

                        <hr className={styles.hr} />

                        {setStart && setDestination && (
                            <div className={styles.buttons}>
                                <div
                                    className={styles.button}
                                    onClick={() => {
                                        setStart({
                                            name: stop.customName || stop.name,
                                            address: {},
                                            lat: stop.location.lat,
                                            lng: stop.location.lng
                                        });
                                    }}
                                >
                                    Set as Start
                                </div>

                                <div
                                    className={styles.button}
                                    onClick={() =>
                                        setDestination({
                                            name:
                                                stop.customName ||
                                                stop.customName,
                                            address: {},
                                            lat: stop.location.lat,
                                            lng: stop.location.lng
                                        })
                                    }
                                >
                                    Set as Destination
                                </div>
                            </div>
                        )}
                    </>
                )
            });
        });

        new mapboxgl.Marker(ele)
            .setLngLat([stop.location.lng, stop.location.lat])
            .addTo(map);
    }
}
