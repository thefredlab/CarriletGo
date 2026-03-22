import { useState, useRef, useEffect } from "react";
import { ArrowDownUp } from "lucide-react";

import SearchResults from "@/components/sidebar/SearchResults";
import RouteStops from "@/components/sidebar/RouteStops";

import getStopByID from "@/data/getStopByID";

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
        [_startLocationConfirmed, setStartLocationConfirmed] =
            useState<boolean>(true),
        [_destinationConfirmed, setDestinationConfirmed] =
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

    useEffect(() => {
        const currentStart = start;

        if (!userLocation.lat && !userLocation.lng && currentStart?.name === "My Location") {
            if (currentRoute.length > 0) {
                currentStart.name = getStopByID(currentRoute[0]).name;

                setStart(currentStart);

                if (startInputRef.current)
                    startInputRef.current.value = currentStart.name;
            } else
                setStart(null);
        }
    }, [userLocation]);

    function searchInputChange(e: React.ChangeEvent<HTMLInputElement>, type: "start" | "destination") {
        const inputValue = e.target.value,
            prevInputValueRef = type === "start" ? prevStartInputValueRef : prevDestinationInputValueRef;

        setActiveSearch(type);

        const searchResults: any[] = [];

        if (userLocation.lat && userLocation.lng) {
            searchResults.push({
                name: "My Location",
                lat: userLocation.lat.toString(),
                lon: userLocation.lng.toString()
            });
        }

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
        }

        // If input is too short, clear results and update previous value
        if (inputValue.trim().length < 3) {
            prevInputValueRef.current = inputValue;
            setSearchResults(searchResults);

            return;
        }

        debounceTimerRef.current = setTimeout(() => {
            if (inputValue.trim() === prevInputValueRef.current.trim())
                return;

            autoCompleteAddress(
                inputValue,
                { lat: userLocation.lat, lng: userLocation.lng },
                (results) => {
                    searchResults.push(...results);

                    setSearchResults(
                        searchResults.map((result) => {
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
            prevInputValueRef.current = inputValue;
        }, 1000);
    }

    function clickedSearchResult(type: "start" | "destination", result: any) {
        setSearchResults([]);

        const inputRef = type === "start" ? startInputRef : destinationInputRef,
            setData = type === "start" ? setStart : setDestination;

        if (result.name === "My Location") {
            setData({
                lat: userLocation.lat,
                lng: userLocation.lng,
                name: "My Location"
            });
        } else {
            setData({
                lat: result.lat,
                lng: result.lng,
                name: result.name,
                address: result.address
            });
        }

        if (inputRef.current) {
            inputRef.current.value =
                result.name || result.address.road || "Unknown Place";
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
                        onChange={(e) => searchInputChange(e, "start")}
                        onFocus={() => {
                            if (userLocation.lat && userLocation.lng) {
                                setActiveSearch("start");
                                setSearchResults([{
                                    name: "My Location",
                                    lat: userLocation.lat.toString(),
                                    lon: userLocation.lng.toString()
                                }]);
                            }
                        }}
                        onBlur={() => {
                            if (searchResults.length === 1 && searchResults[0].name === "My Location")
                                setTimeout(() => setSearchResults([]), 200);
                        }}
                        ref={startInputRef}
                        defaultValue={start?.name}
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
                        onChange={(e) => searchInputChange(e, "destination")}
                        onFocus={() => {
                            if (userLocation.lat && userLocation.lng) {
                                setActiveSearch("destination");
                                setSearchResults([{
                                    name: "My Location",
                                    lat: userLocation.lat.toString(),
                                    lon: userLocation.lng.toString()
                                }]);
                            }
                        }}
                        onBlur={() => {
                            if (searchResults.length === 1 && searchResults[0].name === "My Location")
                                setTimeout(() => setSearchResults([]), 200);
                        }}
                        ref={destinationInputRef}
                        defaultValue={destination?.name}
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
