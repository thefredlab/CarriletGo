import routeWaypoints from "@/data/routeWaypoints";
import lines from "@/data/lines";

export interface RouteLineSegment {
    /** Line ID (e.g. "yellow", "blue", "green", "red") */
    line: string;
    /** Waypoint coordinates for this line segment [lat, lng][] */
    waypoints: [number, number][];
}

/**
 * Get the waypoints for a route from startID to endID, grouped by line.
 * Uses BFS to find the shortest path across all lines through hubs.
 */
export function getRouteWaypoints(
    startID: number,
    endID: number
): RouteLineSegment[] {
    const path = findPath(startID, endID);

    if (!path || path.length === 0) {
        console.error(
            "[getRouteWaypoints]",
            `No path found from ${startID} to ${endID}.`
        );
        return [];
    }

    const result: RouteLineSegment[] = [];

    for (const step of path) {
        const waypointResult = findWaypointsForSegment(step.from, step.to);

        if (!waypointResult) continue;

        const lastSegment = result[result.length - 1];

        if (lastSegment && lastSegment.line === step.lineID) {
            // Same line as previous segment — append waypoints
            const lastWp = lastSegment.waypoints,
                newWps = waypointResult.waypoints;

            // Avoid duplicating the connecting coordinate
            if (
                lastWp.length > 0 &&
                newWps.length > 0 &&
                lastWp[lastWp.length - 1][0] === newWps[0][0] &&
                lastWp[lastWp.length - 1][1] === newWps[0][1]
            ) {
                lastSegment.waypoints.push(...newWps.slice(1));
            } else {
                lastSegment.waypoints.push(...newWps);
            }
        } else {
            // New line — start a new segment
            result.push({
                line: step.lineID,
                waypoints: [...waypointResult.waypoints]
            });
        }
    }

    return result;
}

interface PathStep {
    from: number;
    to: number;
    lineID: string;
}

interface BFSNode {
    stopID: number;
    path: PathStep[];
}

/**
 * Build an adjacency map from all lines.
 * Each stop maps to an array of { neighbor, lineID }.
 * Neighbors are only the directly adjacent stops on a line (forward direction).
 */
function buildGraph(): Map<number, { neighbor: number; lineID: string }[]> {
    const graph = new Map<number, { neighbor: number; lineID: string }[]>();

    for (const line of lines) {
        for (let i = 0; i < line.stops.length - 1; i++) {
            const from = line.stops[i];
            const to = line.stops[i + 1];

            if (!graph.has(from)) graph.set(from, []);
            graph.get(from)!.push({ neighbor: to, lineID: line.lineID });
        }
    }

    return graph;
}

/**
 * BFS to find the shortest path (by number of stops) from startID to endID.
 * Returns an array of PathSteps describing each segment and its line.
 */
function findPath(startID: number, endID: number): PathStep[] | null {
    const graph = buildGraph();
    const visited = new Set<number>();
    const queue: BFSNode[] = [{ stopID: startID, path: [] }];

    visited.add(startID);

    while (queue.length > 0) {
        const current = queue.shift()!;

        if (current.stopID === endID) {
            return current.path;
        }

        const neighbors = graph.get(current.stopID);
        if (!neighbors) continue;

        for (const { neighbor, lineID } of neighbors) {
            if (visited.has(neighbor)) continue;

            visited.add(neighbor);
            queue.push({
                stopID: neighbor,
                path: [
                    ...current.path,
                    { from: current.stopID, to: neighbor, lineID }
                ]
            });
        }
    }

    return null;
}

/**
 * Find the RouteWaypoint for a given segment (from → to).
 */
function findWaypointsForSegment(
    from: number,
    to: number
): { waypoints: [number, number][] } | null {
    for (const route of routeWaypoints) {
        // Check for an exact match [from, to]
        const exactIndex = route.stops.findIndex(
            (pair) => pair[0] === from && pair[1] === to
        );

        if (exactIndex !== -1) {
            const needsReverse = exactIndex !== 0;

            return {
                waypoints: needsReverse
                    ? [...route.waypoints].reverse()
                    : route.waypoints
            };
        }

        // Check for a reversed match [to, from]
        const reversedIndex = route.stops.findIndex(
            (pair) => pair[0] === to && pair[1] === from
        );

        if (reversedIndex !== -1) {
            const needsReverse = reversedIndex === 0;

            return {
                waypoints: needsReverse
                    ? [...route.waypoints].reverse()
                    : route.waypoints
            };
        }
    }

    return null;
}
