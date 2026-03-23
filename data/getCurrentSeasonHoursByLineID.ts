import getMaundyThursdayDate from "@/utils/getMaundyThursdayDate";

/**
 * Determines the current season operating hours for a given line based on its ID.
 * The method calculates seasonal hours considering various time periods, public holidays, and weekends.
 *
 * @param {string} lineID - The unique identifier for the line. Examples include "yellow" or "blue".
 *
 * @return {Array<{startHour: number, lastHour: number}>} Returns an array with one object if there's no break. If there's a break, it returns an array with two objects.
 * Each object specifies the startHour and lastHour. An empty array is returned if no hours are applicable.
 */
export default function getCurrentSeasonHoursByLineID(lineID: string): Array<{ startHour: number; lastHour: number; }> {
    const currentDate = new Date();

    // General data checkpoints
    // June 11th to July 10th
    const isJuneToJuly =
        (currentDate.getMonth() === 5 && currentDate.getDate() >= 11) ||
        (currentDate.getMonth() === 6 && currentDate.getDate() < 11);

    // July 11th to August 31st
    const isJulyToAugust =
        (currentDate.getMonth() === 6 && currentDate.getDate() >= 11) ||
        (currentDate.getMonth() === 7 && currentDate.getDate() <= 31);

    if (lineID === "yellow" || lineID === "blue") {
        // Specific date checkpoints
        // Easter season
        const easterSeasonStart = getMaundyThursdayDate(),
            easterSeasonEnd = new Date(easterSeasonStart);

        easterSeasonEnd.setDate(easterSeasonEnd.getDate() + 5);

        const isEasterSeason =
            currentDate >= easterSeasonStart &&
            currentDate <= easterSeasonEnd;

        // Weekends from April to June
        const isWeekendAprilToJune =
            (currentDate.getDay() === 0 || currentDate.getDay() === 5 || currentDate.getDay() === 6) &&
            (currentDate.getMonth() === 3 ||
                currentDate.getMonth() === 4 ||
                (currentDate.getMonth() === 5 && currentDate.getDate() < 11));

        // September 1st to September 15th
        const isSeptember =
            currentDate.getMonth() === 8 &&
            currentDate.getDate() >= 1 &&
            currentDate.getDate() <= 15;

        switch (true) {
            case isEasterSeason:
            case isWeekendAprilToJune:
                return [
                    {
                        startHour: 10,
                        lastHour: 13
                    },
                    {
                        startHour: 15,
                        lastHour: 20
                    }
                ];

            case isJuneToJuly:
            case isSeptember:
                return [
                    {
                        startHour: 10,
                        lastHour: 13
                    },
                    {
                        startHour: 15,
                        lastHour: 21
                    }
                ];

            case isJulyToAugust:
                return [
                    {
                        startHour: 8,
                        lastHour: 0
                    }
                ];

            default:
                return [];
        }
    } else {
        // Specific date checkpoints
        // September
        const isSeptember = currentDate.getMonth() === 8;

        switch (true) {
            case isJuneToJuly:
            case isSeptember:
                return [
                    {
                        startHour: 11,
                        lastHour: 14
                    },
                    {
                        startHour: 16,
                        lastHour: 22
                    }
                ];

            case isJulyToAugust:
                return [
                    {
                        startHour: 9,
                        lastHour: 0
                    }
                ];

            default:
                return [];
        }
    }
}
