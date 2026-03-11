import type mapboxgl from "mapbox-gl";

/**
 * Creates a pulsing dot on the map to indicate the user's location.
 * @param map
 * @param userLocation
 */
export default function createUserLocationMarking(
    map: mapboxgl.Map,
    userLocation: { lat: number; lng: number }
) {
    const dotSize = 200,
        pulsingDot = {
            width: dotSize,
            height: dotSize,
            data: new Uint8Array(dotSize * dotSize * 4),
            // When the layer is added to the map,
            // get the rendering context for the map canvas.
            onAdd: function () {
                const canvas = document.createElement("canvas");

                canvas.width = this.width;
                canvas.height = this.height;
                // @ts-ignore
                this.context = canvas.getContext("2d");
            },
            // Call once before every frame where the icon will be used.
            render: function () {
                const duration = 1000,
                    t = (performance.now() % duration) / duration;

                const radius = (dotSize / 2) * 0.3,
                    outerRadius = (dotSize / 2) * 0.7 * t + radius;

                // @ts-ignore
                const context = this.context;

                // Draw the outer circle.
                context.clearRect(0, 0, this.width, this.height);
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    outerRadius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = `rgb(0, 98, 204, ${1 - t})`;
                context.fill();

                // Draw the inner circle.
                context.beginPath();
                context.arc(
                    this.width / 2,
                    this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = "rgb(0,110,230)";
                context.strokeStyle = "white";
                context.lineWidth = 2 + 4 * (1 - t);
                context.fill();
                context.stroke();

                // Update this image's data with data from the canvas.
                this.data = context.getImageData(
                    0,
                    0,
                    this.width,
                    this.height
                ).data;

                // Continuously repaint the map, resulting
                // in the smooth animation of the dot.
                map.triggerRepaint();

                // Return `true` to let the map know that the image was updated.
                return true;
            }
        };

    return () => {
        if (!map.hasImage("pulsing-dot"))
            map.addImage("pulsing-dot", pulsingDot, { pixelRatio: 3 });

        console.log(
            "[createUserLocationMarking] Adding user location marker at",
            userLocation.lat,
            userLocation.lng
        );

        if (!map.getSource("user-location")) {
            map.addSource("user-location", {
                type: "geojson",
                data: {
                    type: "FeatureCollection",
                    features: [
                        // @ts-ignore
                        {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: [
                                    userLocation.lng,
                                    userLocation.lat
                                ]
                            }
                        }
                    ]
                }
            });
        }

        if (!map.getLayer("layer-with-pulsing-dot")) {
            map.addLayer({
                id: "layer-with-pulsing-dot",
                type: "symbol",
                source: "user-location",
                layout: {
                    "icon-image": "pulsing-dot",
                    "icon-allow-overlap": true
                }
            });
        }
    };
}
