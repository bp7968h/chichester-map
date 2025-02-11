import { useEffect, useState } from "react"
import Controls from "./components/Controls"
import Help from "./components/Help"
import MapView from "./components/MapView"
import Modal from "./components/modal/Modal";
import { useGraph } from "./hooks/useGraph";
import { Icons } from "./components/ui/icons";
import { useLocation } from "./hooks/useLocation";

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { graphState, pathFn, loadGraphFn } = useGraph();
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();
  const [start, setStart] = useState<{ lat: number; lng: number } | null>(null);
  const [end, setEnd] = useState<{ lat: number; lng: number } | null>(null);
  const [path, setPath] = useState<BigUint64Array | null>(null);

  const handleModalOpen = () => {
    setShowModal((prev) => !prev)
  };

  const handleComputePath = () => {
    if (start && end && pathFn) {
      console.log("Computing shortest path...");
      const result = pathFn(start.lat, start.lng, end.lat, end.lng);
      console.log("Computed Path:", result);
      setPath(result || null);
    }
  };

  useEffect(() => {
    if (!loadGraphFn) {
      return;
    }

    async function loadGraph() {
      const response = await fetch("chichester_city.json");
      const jsonData = await response.text();
      loadGraphFn?.(jsonData);
      setLoading(false);
    }

    if (!graphState) {
      loadGraph()
    };

  }, [graphState, loadGraphFn]);

  useEffect(() => {
    if (location && !start) {
      setStart({ lat: location.latitude, lng: location.longitude });
    }
  }, [location, start]);

  if (loading) return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-white  font-mono">
        <Icons.spinner />
        <p>Loading Graph Engine...</p>
    </div>
  );

  return (
    <div className="realtive w-screen h-screen">
      <MapView start={start} end={end} setStart={setStart} setEnd={setEnd} />
      <Controls start={start} end={end} setStart={setStart} setEnd={setEnd} onVisualize={handleComputePath} />
      <Help onClick={handleModalOpen} />
      {showModal && <Modal onClose={handleModalOpen}/>}
    </div>
  )
}

export default App
