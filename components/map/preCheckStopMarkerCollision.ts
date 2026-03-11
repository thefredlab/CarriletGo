import { Stop } from "@/data/stops";

/**
 * Pre-checks for stop marker collisions. If a collision is detected, the markers are moved slightly away from each other. Check for MIN_DIST in the function for the minimum distance between markers.
 * @param stops
 */
export default function preCheckStopMarkerCollision(stops: {
    [p: number]: Stop;
}): { [p: number]: Stop } {
    /* Min distance between stops to avoid overlapping markers */
    const MIN_DIST = 0.0002;
    const processedStops: Stop[] = [];

    for (let i = 1, len = Object.values(stops).length; i < len; i++) {
        const stop = stops[i];

        const collision = processedStops.find(
            (processedStop) =>
                Math.abs(processedStop.location.lng - stop.location.lng) <
                    MIN_DIST &&
                Math.abs(processedStop.location.lat - stop.location.lat) <
                    MIN_DIST
        );

        if (collision) {
            stop.location.lng += MIN_DIST / 2;
            stop.location.lat += MIN_DIST / 2;

            collision.location.lng -= MIN_DIST / 2;
            collision.location.lat -= MIN_DIST / 2;
        }

        processedStops.push(stop);
    }

    return stops;
}
