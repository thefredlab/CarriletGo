import lines from "@/data/lines";

import type mapboxgl from "mapbox-gl";

export default function deleteRoute(map: mapboxgl.Map) {
    for (const line of lines) {
        const layerID = `route-${line.lineID}-layer`,
            sourceID = `route-${line.lineID}`;

        if (map.getLayer(layerID)) map.removeLayer(layerID);
        if (map.getSource(sourceID)) map.removeSource(sourceID);
    }
}
