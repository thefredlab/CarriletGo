type OSMResult = {
    addresstype: string;
    address?: {
        [key: string]: string | undefined;
    };
    boundingbox: [string, string, string, string];
    category: string;
    display_name: string;
    importance: number;
    lat: string;
    licence: string;
    lon: string;
    name: string;
    osm_id: number;
    osm_type: string;
    place_id: number;
    place_rank: number;
    type: string;
};

export default function autoCompleteAddress(
    input: string,
    userLocation: { lat: number; lng: number },
    callback: (results: OSMResult[]) => void
) {
    if (userLocation.lat === 0 && userLocation.lng === 0 || !userLocation.lat || !userLocation.lng) {
        userLocation.lat = 42.1197584;
        userLocation.lng = 3.143246;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        `${input} ${userLocation.lat}, ${userLocation.lng}`
    )}&countrycodes=ES&format=jsonv2&addressdetails=1&boundingbox=42.1,3.1,42.14,3.2&limit=5`;

    fetch(url)
        .then((response) => response.json())
        .then((data: OSMResult[]) => {
            callback(data);
        })
        .catch((error) => {
            console.error("Error fetching address suggestions:", error);
            callback([]);
        });
}
