"use client";
import { useEffect, useRef, useState } from "react";

// Map components
import createMapInstance from "@/components/map/createMapInstance";
import createUserLocationMarking from "@/components/map/createUserLocationMarking";
import createStopMarkings from "@/components/map/createStopMarkings";
import drawRoute from "@/components/map/drawRoute";
import MapStyleSwitch from "@/components/map/MapStyleSwitch";
import deleteRoute from "@/components/map/deleteRoute";

// Sidebar component
import Sidebar from "@/components/sidebar/Sidebar";

// Navigation components
import getNearestStop from "@/components/nav/getNearestStop";
import getCheapestRoute from "@/components/nav/getCheapestRoute";

// Other components
import UserLocationButton from "@/components/UserLocationButton";
import PopUp from "@/components/PopUp";

// Utils
import useWindowSize from "@/utils/useWindowSize";

// Style
import styles from "./page.module.css";

// Import mapbox
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import getStopByID from "@/data/getStopByID";

export default function Page() {
    const mapContainer = useRef<HTMLDivElement>(null),
        [mapStyle, setMapStyle] = useState<string>("standard");

    const windowSize = useWindowSize();

    // Navigation
    const [start, setStart] = useState<any>(null),
        [destination, setDestination] = useState<any>(null),
        [currentRoute, setCurrentRoute] = useState<number[]>([]),
        [navError, setNavError] = useState<string>(""),
        [selectedStop, setSelectedStop] = useState<{
            name?: string;
            id?: number;
            content?: React.ReactNode;
        }>({});

    // Init useStates
    const [map, setMap] = useState<mapboxgl.Map | null>(null),
        [userLocation, setUserLocation] = useState({
            lat: 0,
            lng: 0
        }),
        [popUpClose, setPopUpClose] = useState<boolean>(true);

    useEffect(() => {
        if (!mapContainer.current) return;

        // @ts-expect-error Already checked above
        setMap(createMapInstance(mapContainer));

        if (userLocation.lat && userLocation.lng) {
            setStart({
                name: "My Location",
                address: {},
                lat: userLocation.lat.toString(),
                lng: userLocation.lng.toString()
            });
        }
    }, [mapContainer.current]);

    useEffect(() => {
        if (!map || !windowSize?.width) return;

        /*
        There are two containers both containing the logo and all position containers (top-left, top-right, bottom-left, bottom-right).
        One container contains a lighter colored logo, and the other one contains a darker colored logo.
        Both are used at the same time. Meaning, we have to move both logos.
         */
        const containers = document.querySelectorAll(
            ".mapboxgl-control-container"
        );

        containers.forEach((container) => {
            const logoElement = container.querySelector(
                ".mapboxgl-ctrl"
            ) as HTMLElement;

            if (!logoElement || !windowSize?.width) return;

            const bottomContainer = container.querySelector(
                    ".mapboxgl-ctrl-bottom-right"
                ),
                topContainer = container.querySelector(
                    ".mapboxgl-ctrl-top-left"
                );

            const newContainer =
                windowSize.width < 700 ? topContainer : bottomContainer;

            if (newContainer && logoElement.parentElement !== newContainer) {
                newContainer.appendChild(logoElement);
            }
        });
    }, [windowSize]);

    useEffect(() => {
        if (!map) {
            console.log("[initMap]", "Map is not initialized yet.");
            return;
        } else console.log("[initMap]", "Map is initialized.");

        map.on("load", () => {
            console.log("[initMap]", "Map has loaded.");

            createStopMarkings(map, setSelectedStop, setStart, setDestination);
            createUserLocationMarking(map, userLocation)();

            // Set the map center to the user location
            if (userLocation.lat && userLocation.lng) {
                map.flyTo({ center: [userLocation.lng, userLocation.lat] });
            }
        });

        map.on("style.load", () => {
            console.log("[initMap]", "Map style has loaded.");

            createUserLocationMarking(map, userLocation)();
        });
    }, [map]);

    useEffect(() => {
        if (!map) return;

        console.log("[mapStyle]", "Changing map style to", mapStyle);
        map.setStyle("mapbox://styles/mapbox/" + mapStyle);
    }, [mapStyle]);

    useEffect(() => {
        if (!map) return;

        const mapSource = map.getSource(
            "user-location"
        ) as mapboxgl.GeoJSONSource;

        // Update user location marker position
        if (mapSource) {
            mapSource.setData({
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: [userLocation.lng, userLocation.lat]
                        },
                        properties: {}
                    }
                ]
            });
        }
    }, [userLocation]);

    useEffect(() => {
        if (!map) return;
        if (!popUpClose) setPopUpClose(true);

        if (start && destination) {
            console.log(
                "[route]",
                "Start and destination are set. Calculating route..."
            );

            const cheapestRoute = getCheapestRoute(
                { lat: start.lat, lng: start.lng },
                { lat: destination.lat, lng: destination.lng }
            );

            let startID: number | null, destinationID: number | null;

            if (cheapestRoute) {
                startID = cheapestRoute[0];
                destinationID = cheapestRoute[cheapestRoute.length - 1];
            } else {
                const startStop = getNearestStop(start.lat, start.lng),
                    destStop = getNearestStop(destination.lat, destination.lng);

                startID = startStop ? parseInt(startStop.id) : null;
                destinationID = destStop ? parseInt(destStop.id) : null;
            }

            if (startID && destinationID) {
                if (startID === destinationID) {
                    setNavError(
                        "Couldn't find a route this time. Try changing the route."
                    );
                    setCurrentRoute([]);
                    deleteRoute(map);

                    return console.warn(
                        "[route]",
                        "Start and destination are the same stop. Ignoring."
                    );
                }

                setNavError("");
                setCurrentRoute(cheapestRoute || []);
                drawRoute(startID, destinationID, map);
            }
        }
    }, [start, destination]);

    useEffect(() => {
        if (selectedStop.name && selectedStop.content) setPopUpClose(false);
    }, [selectedStop]);

    return (
        <>
            <div className={styles.sidebarContainer}>
                <Sidebar
                    userLocation={userLocation}
                    start={start}
                    setStart={setStart}
                    destination={destination}
                    setDestination={setDestination}
                    currentRoute={currentRoute}
                    errorMessage={navError}
                />
            </div>
            {/*<div className={styles.navigatorContainer}>*/}
            {/*    <Navigator />*/}
            {/*</div>*/}
            <div className={styles.topRightContainer}>
                <UserLocationButton setUserLocation={setUserLocation} userLocation={userLocation} />
                <MapStyleSwitch setMapStyle={setMapStyle} />
            </div>

            {selectedStop?.name && selectedStop?.content && !popUpClose && (
                <PopUp
                    content={selectedStop.content}
                    popUpCloseRequest={setPopUpClose}
                />
            )}
            <div ref={mapContainer} className={styles.mapContainer}></div>
        </>
    );
}
