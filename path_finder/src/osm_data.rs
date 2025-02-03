use std::collections::HashMap;

use serde::{Deserialize, Serialize};



/// Represents an OSM node with coordinates and optional tags
#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Node {
    pub id: u64,
    pub lat: f64,
    pub lon: f64,
    pub tags: HashMap<String, String>,
}

/// Represents an OSM way, which consists of multiple nodes and has tags (like road type)
#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct Way {
    pub id: u64,
    pub nodes: Vec<u64>,
    pub tags: HashMap<String, String>,
}

/// Represents the full parsed OSM JSON structure
#[derive(Debug, Serialize, Deserialize)]
pub(crate) struct OSMData {
    pub nodes: Vec<Node>,
    pub ways: Vec<Way>,
}