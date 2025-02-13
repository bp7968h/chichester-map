import { PathPoint } from "@/global";
import init, {load_graph, find_shortest_path, is_graph_loaded} from "path_finder";
import { useEffect, useState } from "react";

export function useGraph() {
    const [graphState, setGraphState] = useState<boolean>(false);
    const [pathFn, setPathFn] = useState<undefined | ((lat1: number, lon1: number, lat2: number, lon2: number) => PathPoint[] | null)>(undefined);
    const [loadGraphFn, setLoadGraphFn] = useState<null | ((json_data: string) => void)>(null);

    useEffect(() => {
        (async () => {
            await init();
            setPathFn(() => (lat1: number, lon1: number, lat2: number, lon2: number) => {
                const result = find_shortest_path(lat1, lon1, lat2, lon2);
                if (result && Array.isArray(result)) {
                    return result.map(node => ({
                        id: node[0],    // Node ID
                        lat: node[1],   // Latitude
                        lng: node[2],   // Longitude
                    }));
                }
                return null;
            });
            setLoadGraphFn(() => load_graph); 
            setGraphState(is_graph_loaded());
        })();
    }, []);

  return { pathFn, loadGraphFn, graphState };
}