import init, {load_graph, find_shortest_path, is_graph_loaded} from "path_finder";
import { useEffect, useState } from "react";

export function useGraph() {
    const [graphState, setGraphState] = useState<boolean>(false);
    const [pathFn, setPathFn] = useState<undefined | ((start: bigint, end: bigint) => BigUint64Array | undefined)>(undefined);
    const [loadGraphFn, setLoadGraphFn] = useState<null | ((json_data: string) => void)>(null);

    useEffect(() => {
        (async () => {
            await init();
            setPathFn(() => find_shortest_path);
            setLoadGraphFn(() => load_graph); 
            setGraphState(is_graph_loaded());
        })();
    }, []);

  return { pathFn, loadGraphFn, graphState };
}