import { getRouteWaypoints } from "@/components/nav/getRouteWaypoints";

import lines from "@/data/lines";

export default function drawRoute(
    startID: number,
    endID: number,
    map: mapboxgl.Map
) {
    const routeSegments = getRouteWaypoints(startID, endID);

    // Clean up previous route layers/sources
    for (const line of lines) {
        const layerID = `route-${line.lineID}-layer`,
            sourceID = `route-${line.lineID}`;

        if (map.getLayer(layerID)) map.removeLayer(layerID);
        if (map.getSource(sourceID)) map.removeSource(sourceID);
    }

    // Draw each line segment with its correct color
    for (const segment of routeSegments) {
        const lineData = lines.find((l) => l.lineID === segment.line);
        const lineColor = lineData?.color ?? "#000000";
        const sourceID = `route-${segment.line}`;
        const layerID = `route-${segment.line}-layer`;

        const geoJSONCoordinates = segment.waypoints.map((coord) => [
            coord[1],
            coord[0]
        ]);

        console.log(
            `[drawRoute] Drawing ${segment.line} line with ${geoJSONCoordinates.length} coordinates`
        );

        map.addSource(sourceID, {
            type: "geojson",
            data: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: geoJSONCoordinates
                }
            }
        });

        map.addLayer({
            id: layerID,
            type: "line",
            source: sourceID,
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
                "line-color": lineColor,
                "line-width": 8
            }
        });
    }
}
