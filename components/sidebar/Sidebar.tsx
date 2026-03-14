import { useState, useRef, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";

import SearchResults from "@/components/sidebar/SearchResults";
import RouteStops from "@/components/sidebar/RouteStops";

import autoCompleteAddress from "@/utils/autoCompleteAddress";

import styles from "./Sidebar.module.css";

export default function Sidebar({
    userLocation,
    start,
    setStart,
    destination,
    setDestination,
    currentRoute,
    errorMessage
}: {
    userLocation: { lat: number; lng: number };
    start: any;
    setStart: React.Dispatch<React.SetStateAction<any>>;
    destination: any;
    setDestination: React.Dispatch<React.SetStateAction<any>>;
    currentRoute: number[];
    errorMessage: string;
}) {
    const [searchResults, setSearchResults] = useState<any[]>([]),
        [startLocationConfirmed, setStartLocationConfirmed] =
            useState<boolean>(true),
        [destinationConfirmed, setDestinationConfirmed] =
            useState<boolean>(false),
        [activeSearch, setActiveSearch] = useState<
            "start" | "destination" | null
        >(null);

    const startInputRef = useRef<HTMLInputElement>(null),
        destinationInputRef = useRef<HTMLInputElement>(null);

    const prevDestinationInputValueRef = useRef<string>(""),
        prevStartInputValueRef = useRef<string>(""),
        debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null),
        directionSwapIconRef = useRef<SVGSVGElement>(null);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current)
                clearTimeout(debounceTimerRef.current);
        };
    }, []);

    function startInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = e.target.value;

        setActiveSearch("start");

        const resultsWithUserLocation = [
            {
                name: "My Location",
                lat: userLocation.lat.toString(),
                lon: userLocation.lng.toString()
            }
        ];

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        // If input is too short, clear results and update previous value
        if (inputValue.trim().length < 3) {
            prevStartInputValueRef.current = inputValue;
            setSearchResults(resultsWithUserLocation);
            return;
        }

        // Start debounce timer (1.5s)
        debounceTimerRef.current = setTimeout(() => {
            if (inputValue.trim() === prevStartInputValueRef.current.trim())
                return;

            autoCompleteAddress(
                inputValue,
                { lat: userLocation.lat, lng: userLocation.lng }, // Use actual user location here
                (results) => {
                    resultsWithUserLocation.push(...results);

                    setSearchResults(
                        resultsWithUserLocation.map((result) => {
                            return {
                                name: result.name,
                                // @ts-ignore TODO: FIX THIS
                                address: result.address,
                                lat: result.lat,
                                lng: result.lon
                            };
                        })
                    );
                }
            );

            // Update previous settled value
            prevStartInputValueRef.current = inputValue;
        }, 1000);
    }

    function destinationInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const inputValue = e.target.value;

        setActiveSearch("destination");

        const resultsWithUserLocation = [
            {
                name: "My Location",
                lat: userLocation.lat.toString(),
                lon: userLocation.lng.toString()
            }
        ];

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        // If input is too short, clear results and update previous value
        if (inputValue.trim().length < 3) {
            prevDestinationInputValueRef.current = inputValue;
            setSearchResults(resultsWithUserLocation);
            return;
        }

        // Start debounce timer (1.5s)
        debounceTimerRef.current = setTimeout(() => {
            if (
                inputValue.trim() ===
                prevDestinationInputValueRef.current.trim()
            )
                return;

            autoCompleteAddress(
                inputValue,
                { lat: userLocation.lat, lng: userLocation.lng }, // Use actual user location here
                (results) => {
                    resultsWithUserLocation.push(...results);

                    setSearchResults(
                        resultsWithUserLocation.map((result) => {
                            return {
                                name: result.name,
                                // @ts-ignore TODO: FIX THIS
                                address: result.address,
                                lat: result.lat,
                                lng: result.lon
                            };
                        })
                    );
                }
            );

            // Update previous settled value
            prevDestinationInputValueRef.current = inputValue;
        }, 1000);
    }

    function clickedSearchResult(type: "start" | "destination", result: any) {
        setSearchResults([]);

        if (type === "destination") {
            setDestinationConfirmed(true);
            setDestination({
                lat: result.lat,
                lng: result.lng,
                name: result.name,
                address: result.address
            });

            if (destinationInputRef.current) {
                destinationInputRef.current.value =
                    result.name || result.address.road || "Unknown Place";
            }
        } else {
            setStartLocationConfirmed(true);

            if (startInputRef.current?.value.trim() == "My Location") {
                setStart({
                    lat: userLocation.lat,
                    lng: userLocation.lng,
                    name: "My Location"
                });
            } else {
                setStart({
                    lat: result.lat,
                    lng: result.lng,
                    name: result.name,
                    address: result.address
                });

                if (startInputRef.current) {
                    startInputRef.current.value =
                        result.name || result.address.road || "Unknown Place";
                }
            }
        }
    }

    function switchStartAndDestination() {
        if (directionSwapIconRef.current) {
            directionSwapIconRef.current.classList.add(styles.active);

            setTimeout(() => {
                if (directionSwapIconRef.current) {
                    directionSwapIconRef.current.classList.remove(
                        styles.active
                    );
                }
            }, 250);
        }

        const currentStart = start,
            currentDestination = destination;

        setStart(currentDestination);
        setDestination(currentStart);

        setTimeout(() => {
            startInputRef.current!.value = currentDestination
                ? currentDestination.name || "Unknown Place"
                : "";

            destinationInputRef.current!.value = currentStart
                ? currentStart.name || "Unknown Place"
                : "";
        }, 125);
    }

    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.logo}>
                    <h1>CarriletGo</h1>
                    <span>BETA</span>
                </div>

                <div className={styles.searchFieldContainer}>
                    <label
                        className={styles.searchFieldLabel}
                        htmlFor={"start-location-input"}
                    >
                        Starting point
                    </label>

                    <input
                        className={styles.searchField}
                        id={"start-location-input"}
                        placeholder={"Where from?"}
                        onChange={startInputChange}
                        ref={startInputRef}
                        defaultValue={start?.name || ""}
                    />

                    <div
                        className={styles.directionSwap}
                        onClick={switchStartAndDestination}
                    >
                        <ArrowDownUp
                            size={"2em"}
                            className={styles.directionSwapIcon}
                            ref={directionSwapIconRef}
                        />
                    </div>
                </div>

                <div className={styles.searchFieldContainer}>
                    <label
                        className={styles.searchFieldLabel}
                        htmlFor={"end-location-input"}
                    >
                        Destination
                    </label>

                    <input
                        className={styles.searchField}
                        id={"end-location-input"}
                        placeholder={"Where to?"}
                        onChange={destinationInputChange}
                        ref={destinationInputRef}
                        defaultValue={destination?.name || ""}
                    />
                </div>

                {searchResults.length === 0 && errorMessage.length > 0 && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}

                <div className={styles.searchResults}>
                    <SearchResults
                        searchResults={searchResults}
                        clickedSearchResult={clickedSearchResult}
                        activeSearch={activeSearch}
                    />
                </div>

                <div className={styles.routeStops}>
                    <RouteStops
                        currentRoute={currentRoute}
                        searchResults={searchResults}
                    />
                </div>

                <div className={styles.note}>
                    <span>Made by The Fred Lab &#8226; </span>
                    <a
                        href="https://github.com/thefredlab/CarriletGo"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        GitHub
                    </a>
                </div>
            </div>
        </>
    );
}
