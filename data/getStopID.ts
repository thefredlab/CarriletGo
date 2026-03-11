import stops from "./stops";

export default function getStopID(lat: number, lng: number, stopName?: string) {
    const match = Object.entries(stops).find(
        ([, stop]) =>
            (stopName
                ? stop.name === stopName || stop.customName === stopName
                : true) &&
            stop.location.lat === lat &&
            stop.location.lng === lng
    )?.[0];

    return match ? parseInt(match) : -1;
}
