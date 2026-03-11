import stops from "@/data/stops";

export default function getStopByID(stopID: number) {
    return stops[stopID];
}
