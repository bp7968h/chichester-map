import { useEffect, useState } from "react"
import Controls from "./components/Controls"
import Help from "./components/Help"
import MapView from "./components/MapView"
import Modal from "./components/modal/Modal";
import { useGraph } from "./hooks/useGraph";
import { Icons } from "./components/ui/icons";

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { graphState, pathFn, loadGraphFn } = useGraph();
  const [loading, setLoading] = useState(true);

  const handleModalOpen = () => {
    console.log("Modal is: ", showModal);
    setShowModal((prev) => !prev)
  }

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

  if (loading) return (
    <div className="w-screen h-screen flex flex-col items-center justify-center text-white  font-mono">
            <Icons.spinner />
            <p>Loading Graph...</p>
        </div>
  );

  return (
    <div className="realtive w-screen h-screen">
      <MapView />
      <Controls />
      <Help onClick={handleModalOpen} />
      {showModal && <Modal onClose={handleModalOpen}/>}
    </div>
  )
}

export default App
