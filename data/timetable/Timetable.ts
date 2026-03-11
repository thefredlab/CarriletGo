export default interface Timetable {
    /* Whether a timetable is used for all seasons or a reduced set. Important: all timetables are different across the seasons! */
    allSeasons: boolean;
    timetable: {
        [key: number]: {
            /* First hour of operation */
            firstHour: number;
            /* Last hour of operation */
            lastHour: number;
            /* Minute in which the train arrives/departs at the stop */
            min: number;
        };
    };
}
