import getCurrentSeasonHoursByLineID from "@/data/getCurrentSeasonHoursByLineID";
import getLineByStopID from "@/data/getLineByStopID";

import lines from "@/data/lines";

/**
 * Retrieves the departure times for a specific stop ID, optionally filtered by a specific line ID.
 *
 * @param {number} stopID - The ID of the stop for which departure times are to be retrieved.
 * @param {string} [lineID] - An optional ID of the line to narrow down the search for the timetable.
 * @param {boolean} [checkSeason=true] - Whether to check if the current hour is within the season hours for the specified line.
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
    lineID?: string,
    checkSeason: boolean = true
): {
    formatted: string[];
    unformatted: Date[];
    timetable?: {
        firstHour: number;
        lastHour: number;
        min: number;
    };
} {
    const line = lineID
            ? lines.find((line) => line.lineID === lineID)
            : getLineByStopID(stopID),
        timetable = line?.timetable?.timetable[stopID];

    if (!timetable) return { formatted: [], unformatted: [] };

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

    const seasonHours = checkSeason ? getCurrentSeasonHoursByLineID(line?.lineID) : [];

    if (checkSeason && seasonHours.length === 0) {
        return {
            formatted: [],
            unformatted,
            timetable
        };
    }

    for (let i = forLoopFirstHour; i <= forLoopLastHour; i++) {
        const formattedTime = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            i,
            timetable.min
        );

        if (seasonHours.length > 0) {
            const currentHour = formattedTime.getHours();
            const isInsideSeasonHours = seasonHours.some((season) => {
                const startHour = season.startHour;
                const lastHour = season.lastHour === 0 ? 24 : season.lastHour;

                return currentHour >= startHour && currentHour <= lastHour;
            });

            if (!isInsideSeasonHours) continue;
        }

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
