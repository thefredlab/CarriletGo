import lines from "@/data/lines";
import getLineByStopID from "@/data/getLineByStopID";

/**
 * Retrieves the departure times for a specific stop ID, optionally filtered by a specific line ID.
 *
 * @param {number} stopID - The ID of the stop for which departure times are to be retrieved.
 * @param {string} [lineID] - An optional ID of the line to narrow down the search for the timetable.
 * @returns {{
 *     formatted: string[];
 *     unformatted: Date[];
 *     timetable?: {
 *         firstHour: number;
 *         lastHour: number;
 *         min: number;
 *     };
 * }} - An object containing two arrays, one formatted and one unformatted with departure times, and optionally the timetable details.
 */
export default function getDepartureTimesByStopID(
    stopID: number,
    lineID?: string
) {
    const line = lineID
            ? lines.find((line) => line.lineID === lineID)
            : getLineByStopID(stopID),
        timetable = line?.timetable?.timetable[stopID];

    if (!timetable) return { formatted: [] };

    // TODO: Season check

    const unformatted: Date[] = [];

    for (
        let i = timetable.firstHour, len = timetable.lastHour + 1;
        i < len;
        i++
    ) {
        unformatted.push(
            new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate(),
                i,
                timetable.min
            )
        );
    }

    const formatted: string[] = [],
        date = new Date();

    // If the current hour is between the first and last hour of the timetable, use that hour, else use first hour (last hour could be 0 for 24h)
    const forLoopFirstHour =
            (date.getHours() >= timetable.firstHour &&
                date.getHours() <= timetable.lastHour) ||
            (timetable.lastHour === 0 &&
                (date.getHours() === 0 || date.getHours() === 23))
                ? date.getHours()
                : timetable.firstHour,
        forLoopLastHour = timetable.lastHour === 0 ? 24 : timetable.lastHour;

    for (let i = forLoopFirstHour; i <= forLoopLastHour; i++) {
        const formattedTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            i,
            timetable.min
        );

        formatted.push(
            formattedTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })
        );
    }

    return {
        formatted,
        unformatted,
        timetable
    };
}
