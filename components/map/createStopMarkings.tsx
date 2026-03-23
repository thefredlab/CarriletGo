import preCheckStopMarkerCollision from "@/components/map/preCheckStopMarkerCollision";
import stops from "@/data/stops";

import mapboxgl from "mapbox-gl";

import type { Dispatch, SetStateAction } from "react";

/**
 * Creates stop markers on the map and attaches relevant event handlers for user interaction.
 *
 * @param {mapboxgl.Map} map - The Mapbox GL map instance where the stop markers will be rendered.
 * @param selectedStopID - Optional function to handle the selection of a stop.
 * @return {void} This function does not return a value but modifies the map instance by adding stop markers.
 */
export default function createStopMarkings(
    map: mapboxgl.Map,
    selectedStopID?: Dispatch<SetStateAction<number | undefined>>
) {
    const checkedStops = preCheckStopMarkerCollision(stops);

    for (let i = 1, len = Object.values(checkedStops).length; i <= len; i++) {
        const stop = checkedStops[i],
            stopID = `stop-${i}`;

        if (process.env.NODE_ENV === "development") {
            console.log(
                "[createStopMarkings]",
                `Adding stop marker for stop ID ${i} (${
                    stop.name ?? stop.customName
                }) at coordinates [${stop.location.lng}, ${stop.location.lat}]`
            );
        }

        map.addSource(stopID, {
            type: "geojson",
            data: {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates: [stop.location.lng, stop.location.lat]
                },
                properties: {
                    label: stop.name ?? stop.customName,
                    stopNo: i
                }
            }
        });

        const ele = document.createElement("div"),
            widthHeight = 30;

        ele.style.backgroundImage = `url("/stops/${i}.png")`;
        ele.style.width = `${widthHeight}px`;
        ele.style.height = `${widthHeight}px`;
        ele.style.backgroundSize = "contain";
        ele.style.backgroundRepeat = "no-repeat";

        ele.addEventListener("click", () => {
            map.flyTo({
                center: [stop.location.lng, stop.location.lat],
                essential: true
            });

            selectedStopID?.(i);
        });

        new mapboxgl.Marker(ele)
            .setLngLat([stop.location.lng, stop.location.lat])
            .addTo(map);
    }
}
