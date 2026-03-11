import { LocateFixed, MapPinned } from "lucide-react";

import styles from "@/components/sidebar/Sidebar.module.css";

export default function SearchResults({
    searchResults,
    clickedSearchResult,
    activeSearch
}: {
    searchResults: any[];
    clickedSearchResult: (type: "start" | "destination", result: any) => void;
    activeSearch: "start" | "destination" | null;
}) {
    return (
        <>
            {searchResults.length > 0 &&
                searchResults.map((result, index) => (
                    <div
                        key={result.lat + result.lng + index}
                        className={styles.searchResult}
                        onClick={() =>
                            clickedSearchResult(activeSearch!, result)
                        }
                    >
                        <div className={styles.searchResultIconContainer}>
                            {result.name === "My Location" ? (
                                <LocateFixed
                                    className={[
                                        styles.searchResultIcon,
                                        styles.userLocation
                                    ].join(" ")}
                                    strokeWidth={2}
                                />
                            ) : (
                                <MapPinned
                                    className={styles.searchResultIcon}
                                    strokeWidth={2}
                                />
                            )}
                        </div>
                        <div className={styles.searchResultDescription}>
                            <h2 className={styles.searchResultTitle}>
                                {result.name || "Unknown Place"}
                            </h2>
                            {result.name !== "My Location" && (
                                <p className={styles.searchResultSubtitle}>
                                    {result.address.road || "Unknown Road"}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
        </>
    );
}
