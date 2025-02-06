pub mod graph;
pub(crate) mod osm_data;

pub use graph::Graph;

use lazy_static::lazy_static;
use osm_data::OSMData;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

lazy_static! {
    static ref GRAPH: Mutex<Option<Graph>> = Mutex::new(None);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

#[wasm_bindgen(start)]
pub fn initialize() {
    log("WASM Initialized!");
}

#[wasm_bindgen]
pub fn load_graph(json_data: &str) -> Result<(), JsValue> {
    log("Loading Graph from JSON...");

    let osm_data: OSMData = serde_json::from_str(json_data).map_err(|e| {
        log("Invalid JSON format.");
        JsValue::from_str(&format!("Invalid JSON: {}", e))
    })?;

    let graph = Graph::from_osm_data(osm_data).map_err(|e| {
        log("Graph creation failed.");
        JsValue::from_str(&format!("Graph creation failed: {}", e))
    })?;

    let mut g = GRAPH.lock().unwrap();
    *g = Some(graph);

    log("Graph successfully loaded into memory!");
    Ok(())
}

#[wasm_bindgen]
pub fn find_shortest_path(start: u64, end: u64) -> Option<Vec<u64>> {
    let g = GRAPH.lock().expect("Failed to lock GRAPH");
    if let Some(ref graph) = *g {
        let path = graph.find_shortest_path(start, end);
        Some(path)
    } else {
        None
    }
}

#[wasm_bindgen]
pub fn is_graph_loaded() -> bool {
    GRAPH.lock().unwrap().is_some()
}
