import { useState } from "react"
import Controls from "./components/Controls"
import Help from "./components/Help"
import MapView from "./components/MapView"
import Modal from "./components/modal/Modal";

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleModalOpen = () => {
    console.log("Modal is: ", showModal);
    setShowModal((prev) => !prev)
  }

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
