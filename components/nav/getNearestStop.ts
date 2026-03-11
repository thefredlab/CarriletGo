import stops from "@/data/stops";

export default function getNearestStop(lat: number, lng: number) {
    let nearestStop = null;
    let minDistance = Infinity;

    for (const [id, stop] of Object.entries(stops)) {
        const distance = Math.sqrt(
            Math.pow(stop.location.lat - lat, 2) +
                Math.pow(stop.location.lng - lng, 2)
        );

        if (distance < minDistance) {
            minDistance = distance;
            nearestStop = { id, ...stop };
        }
    }

    return nearestStop;
}
