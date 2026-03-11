import yellowLine from "@/data/timetable/yellowLine";
import blueLine from "@/data/timetable/blueLine";
import greenLine from "@/data/timetable/greenLine";
import redLine from "@/data/timetable/redLine";

import type Timetable from "@/data/timetable/Timetable";

interface Line {
    /* Name of the line. */
    name: string;
    /* ID of the line. */
    lineID: string;
    /* Hexadecimal color code of the line. */
    color: string;
    /* Array of stop IDs. Sorted from first to last stop. */
    stops: number[];
    /* Timetable of the line. */
    timetable: Timetable;
}

const yellow: Line = {
    name: "Yellow Line",
    lineID: "yellow",
    color: "#FFCC00",
    stops: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    timetable: yellowLine
};

const blue: Line = {
    name: "Blue Line",
    lineID: "blue",
    color: "#0088FF",
    stops: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 1],
    timetable: blueLine
};

const green: Line = {
    name: "Green Line",
    lineID: "green",
    color: "#34C759",
    stops: [1, 24, 25, 26, 27, 28],
    timetable: greenLine
};

const red: Line = {
    name: "Red Line",
    lineID: "red",
    color: "#FF383C",
    stops: [28, 29, 30, 31, 32, 33, 34, 1],
    timetable: redLine
};

const lines: Line[] = [yellow, blue, green, red];
export default lines;
