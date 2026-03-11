import mapboxgl from "mapbox-gl";

import type React from "react";

/**
 * Creates a map instance.
 * @param mapContainer
 */
export default function createMapInstance(
    mapContainer: React.RefObject<HTMLDivElement>
) {
    return new mapboxgl.Map({
        accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string,
        container: mapContainer.current as HTMLElement,
        style: "mapbox://styles/mapbox/standard",
        center: [3.143246, 42.1197584],
        zoom: 13.5,
        pitch: 30,
        minZoom: 12,
        maxZoom: 18,
        maxBounds: [
            [3.1, 42.1],
            [3.2, 42.14]
        ],
        antialias: true,
        testMode: true,
        attributionControl: false,
        logoPosition: "bottom-right"
    });
}
