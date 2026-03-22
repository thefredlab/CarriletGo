export default function isCoordsInMapBounds(coords: { lat: number, lng: number }): boolean {
    const maxBounds = [
        [42.1, 3.1],
        [42.14, 3.2]
    ];

    return coords.lat >= maxBounds[0][0] && coords.lat <= maxBounds[1][0] &&
        coords.lng >= maxBounds[0][1] && coords.lng <= maxBounds[1][1];
}