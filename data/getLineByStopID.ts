import lines from "@/data/lines";

/**
 * Get the line that a stop belongs to.
 * @param stopID - The stop identifier to look up.
 * @param includesStopIDs - Optional array of stop IDs that must also be present on the line.
 * @returns The matching line object or undefined if no match is found.
 */
export default function getLineByStopID(
    stopID: number,
    includesStopIDs?: number[]
) {
    // Basic find if no must-have stops are specified
    if (!includesStopIDs || includesStopIDs.length === 0)
        return lines.find((line) => line.stops.includes(stopID));
    else {
        return lines.find(
            (line) =>
                line.stops.includes(stopID) &&
                line.stops.some((s) => includesStopIDs.includes(s))
        );
    }
}
