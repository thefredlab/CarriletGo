import getMaundyThursdayDate from "@/utils/getMaundyThursdayDate";

/**
 * Determines the current season operating hours for a given line based on its ID.
 * The method calculates seasonal hours considering various time periods, public holidays, and weekends.
 *
 * @param {string} lineID - The unique identifier for the line. Examples include "yellow" or "blue".
 *
 * @return {Array<{startHour: number, lastHour: number}>} An array of objects representing time ranges for current season hours.
 * Each object specifies the startHour and lastHour. An empty array is returned if no hours are applicable.
 */
export default function getCurrentSeasonHoursByLineID(lineID: string) {
    const currentDate = new Date();

    // General data checkpoints
    // June 11th to July 10th
    const isJunetoJuly =
        (currentDate.getMonth() === 5 && currentDate.getDate() >= 11) ||
        (currentDate.getMonth() === 6 && currentDate.getDate() < 11);

    // July 11th to August 31st
    const isJulytoAugust =
        (currentDate.getMonth() === 6 && currentDate.getDate() >= 11) ||
        (currentDate.getMonth() === 7 && currentDate.getDate() < 31);

    if (lineID === "yellow" || lineID === "blue") {
        // Specific date checkpoints
        // Easter season
        const easterSeasonStart = getMaundyThursdayDate(),
            easterSeasonEnd = new Date(currentDate.getFullYear(), 6, 10),
            isEasterSeason =
                currentDate >= easterSeasonStart &&
                currentDate <= easterSeasonEnd;

        // Weekends from April to June
        const isWeekendAprilToJune =
            (currentDate.getDay() === 0 || currentDate.getDay() === 5) &&
            currentDate.getMonth() >= 3 &&
            currentDate.getMonth() <= 5;

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

            case isJunetoJuly:
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

            case isJulytoAugust:
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
            case isJunetoJuly:
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

            case isJulytoAugust:
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
