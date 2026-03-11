import { Stop } from "@/data/stops";

import stops from "@/data/stops";
import lines from "@/data/lines";

/**
 * Calculate Euclidean distance between two coordinate pairs.
 */
function distance(
    a: { lat: number; lng: number },
    b: { lat: number; lng: number }
): number {
    return Math.sqrt(Math.pow(a.lat - b.lat, 2) + Math.pow(a.lng - b.lng, 2));
}

/**
 * Get the N nearest stops to a given coordinate, sorted by distance.
 */
function getNearestStops(
    lat: number,
    lng: number,
    count: number
): { id: number; stop: Stop; dist: number }[] {
    const results: { id: number; stop: Stop; dist: number }[] = [];

    for (const [id, stop] of Object.entries(stops)) {
        const dist = distance({ lat, lng }, stop.location);
        results.push({ id: parseInt(id), stop, dist });
    }

    results.sort((a, b) => a.dist - b.dist);
    return results.slice(0, count);
}

/**
 * Build a directed adjacency graph from all lines.
 * Each stop maps to an array of { neighbor, lineID, lineIdx }.
 * Edges only go forward (stops[i] → stops[i+1]), respecting line direction.
 */
function buildGraph(): Map<
    number,
    { neighbor: number; lineID: string; lineIdx: number }[]
> {
    const graph = new Map<
        number,
        { neighbor: number; lineID: string; lineIdx: number }[]
    >();

    lines.forEach((line, lineIdx) => {
        for (let i = 0; i < line.stops.length - 1; i++) {
            const from = line.stops[i];
            const to = line.stops[i + 1];

            if (!graph.has(from)) graph.set(from, []);
            graph.get(from)!.push({
                neighbor: to,
                lineID: (line as any).lineID,
                lineIdx
            });
        }
    });

    return graph;
}

/**
 * Find the cheapest route (fewest line changes) between two stop IDs
 * using BFS, respecting line direction (forward only).
 * Returns { changes, path } or null if no route exists.
 */
function findRoute(
    startID: number,
    endID: number
): { changes: number; path: number[] } | null {
    if (startID === endID) return { changes: 0, path: [startID] };

    const graph = buildGraph();

    interface State {
        stopID: number;
        currentLine: number | null;
        path: number[];
        changes: number;
    }

    // visited key = stopID:lineIdx (or stopID:null for initial)
    const visited = new Set<string>();
    const queue: State[] = [
        {
            stopID: startID,
            currentLine: null,
            path: [startID],
            changes: 0
        }
    ];
    visited.add(`${startID}:null`);

    while (queue.length > 0) {
        const { stopID, currentLine, path, changes } = queue.shift()!;

        const neighbors = graph.get(stopID);
        if (!neighbors) continue;

        for (const { neighbor, lineIdx } of neighbors) {
            const lineChanged = currentLine !== null && lineIdx !== currentLine;
            const newChanges = changes + (lineChanged ? 1 : 0);
            const newPath = [...path, neighbor];

            if (neighbor === endID) {
                return { changes: newChanges, path: newPath };
            }

            const key = `${neighbor}:${lineIdx}`;
            if (visited.has(key)) continue;
            visited.add(key);

            queue.push({
                stopID: neighbor,
                currentLine: lineIdx,
                path: newPath,
                changes: newChanges
            });
        }
    }

    return null;
}

/**
 * Finds the cheapest route between two coordinate pairs.
 * "Cheapest" = fewest line changes. Among equal-change routes,
 * the one with the shortest total walking distance (to start stop +
 * from end stop) wins.
 *
 * This considers multiple candidate stops near both start and end
 * coordinates, so that e.g. walking slightly further to a stop on
 * the same line as the destination avoids an expensive line change.
 */
export default function getCheapestRoute(
    start: { lat: number; lng: number },
    end: { lat: number; lng: number }
): number[] {
    const candidateCount = 6;
    const startCandidates = getNearestStops(
        start.lat,
        start.lng,
        candidateCount
    );
    const endCandidates = getNearestStops(end.lat, end.lng, candidateCount);

    let bestRoute: number[] = [];
    let bestChanges = Infinity;
    let bestWalkDist = Infinity;

    for (const sc of startCandidates) {
        for (const ec of endCandidates) {
            const result = findRoute(sc.id, ec.id);
            if (!result) continue;

            const totalWalk = sc.dist + ec.dist;

            // Prefer fewer line changes first, then shorter walk
            if (
                result.changes < bestChanges ||
                (result.changes === bestChanges && totalWalk < bestWalkDist)
            ) {
                bestChanges = result.changes;
                bestWalkDist = totalWalk;
                bestRoute = result.path;
            }
        }
    }

    return bestRoute;
}
