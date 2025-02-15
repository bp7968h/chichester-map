const ModalData = {
    title: "What is This Broo!!",
    descsriptin: (
      <>
        <p>
          While documenting GIS architecture at my workplace, I got curious about **how mapping systems like Google Maps work.** This project is my attempt to **build a simplified version from scratch**, using **OpenStreetMap (OSM), Rust, WebAssembly (WASM), and React.**
        </p>
      </>
    ),
    details: [
      {
        title: "🔧 How does this work?",
        content: (
          <>
            <p>
              The core algorithm and data structure implementation are written in Rust. Functions are exposed using **WebAssembly (WASM)** which is used by the **React** frontend:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2">
              <li>
                <strong>OSM Data Processing</strong>: An **OSM file** (exported from OpenStreetMap) is included in the repository.
              </li>
              <li>
                <strong>Rust Binary for Conversion</strong>: During the **GitHub deployment phase**, a **Rust binary** converts this OSM data into **JSON format**.
              </li>
              <li>
                <strong>Frontend Graph Construction</strong>: When the application loads in the browser, the JSON file is **fetched and parsed into a weighted graph and rtree**.
              </li>
              <li>
                <strong>Distance Calculation</strong>: The graph edges are weighted using **Haversine formula** to compute real-world distances between nodes.
              </li>
              <li>
                <strong>Nearest Node Lookup</strong>: An **R-tree spatial index** is built to efficiently find the nearest node for a given latitude & longitude.
              </li>
              <li>
                <strong>Pathfinding Algorithms</strong>: Supports **Dijkstra's Algorithm** (A* and Bellman-Ford to be implemented) for shortest path calculation.
              </li>
              <li>
                <strong>Fully In-Memory Processing</strong>: Everything runs **in-memory using WebAssembly (WASM)**, making it **fast & efficient** without needing a backend.
              </li>
              <li>
                <strong>Frontend Tech Stack</strong>: The UI is built with **React, Vite, Leaflet.js, and ShadCN** for an interactive and responsive experience. 
              </li>
            </ul>
          </>
        ),
      },
        {
          title: "🚀 What are the supported features?",
          content: (
            <>
             <ul className="list-disc list-inside text-gray-300">
              <li>🗺️ Interactive map using **Leaflet.js**</li>
              <li>📍 Click & drag markers to set **start & end points**</li>
              <li>📊 Supports multiple **pathfinding algorithms** (Dijkstra, A*, Bellman-Ford)</li>
              <li>⚡ Fast route calculation using **Rust + WASM** (WebAssembly)</li>
              <li>🖥️ Runs completely **in-browser (No backend needed)**</li>
              <li>🌐 Uses **OpenStreetMap (OSM) XML data** for real-world road networks</li>
            </ul>
            </>
          ),
        },
        {
          title: "❌ What is not supported yet?",
          content: (
            <>
              <ul className="list-disc list-inside text-gray-300">
                <li>
                  🛣️ <strong>Full Chichester City Map</strong> – Currently, only a subset of Chichester is loaded.
                </li>
                <li>
                  🔍 <strong>Search by Location Name</strong> – A Trie data structure might be implemented to allow searching for places by name.
                </li>
                <li>
                  🚀 <strong>Additional Pathfinding Algorithms</strong> – A* and Bellman-Ford are yet to be implemented.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "🌍 Why is this an SSR site?",
          content: (
            <p className="text-gray-300">
            I don’t have a backend server, so this is a fully **client-side application** hosted using **GitHub Pages**. The entire app runs in the browser using **WebAssembly (WASM)** for performance optimization.
          </p>
          ),
        },
        {
          title: "📂 Where is the code?",
          content: (
            <>
            <p>You can find all the code (**osm to json converter**, **wasm library to load graph**, **frontend**) for this project in the below github repository</p>
            <ul className="list-disc list-inside text-gray-300">
              <li>
                <a
                  href="https://github.com/bp7968h/chytrails"
                  className="text-blue-400 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chy Trials (GitHub Repo)
                </a>
              </li>
            </ul>
            </>
          ),
        },
        {
          title: "🙏 Acknowledgements",
          content: (
            <ul className="list-disc list-inside text-gray-300">
            <li>💡 Inspired by **Curosity** of **Google Maps**</li>
            <li>⚙️ Special thanks to **OpenStreetMap (OSM)** and **Leaflet.js** for providing free map data and map</li>
            <li>🚀 Learning from **Rust, WebAssembly, and pathfinding algorithms**</li>
          </ul>
          ),
        },
      ],
};

export default ModalData;