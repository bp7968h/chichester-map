use std::{collections::HashMap, error::Error, fs::File, io::BufReader};

use serde::{Deserialize, Serialize};

use crate::osm_data::OSMData;


/// This represents the weighted graph
/// Where each will have a id of the node as the key
/// And the tuple with another node id and the calculated distance
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Graph{
    adj_list: HashMap<u64, Vec<(u64, f32)>>
}

impl Graph {
    pub fn new() -> Self {
        Graph { ..Default::default() }
    }

    pub fn from_json_file(path: &str) -> Result<Self, Box<dyn Error>> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);

        let osm_data: OSMData = serde_json::from_reader(reader)?;
        
        let mut graph = Graph::new();

        let mut node_map: HashMap<u64, (f64, f64)> = HashMap::new();
        for node in &osm_data.nodes {
            node_map.insert(node.id, (node.lat, node.lon));
        }

        for way in &osm_data.ways {
            let is_oneway = way.tags.get("oneway").map_or(false, |v| v == "yes");

            for pair in way.nodes.windows(2) {
                let from_id = pair[0];
                let to_id = pair[1];

                if let (Some(&from_coords), Some(&to_coords)) = (node_map.get(&from_id), node_map.get(&to_id)) {
                    if is_oneway {
                        graph.add_edge_one_way((from_id, from_coords.0, from_coords.1), (to_id, to_coords.0, to_coords.1));
                    } else {
                        graph.add_edge_two_way((from_id, from_coords.0, from_coords.1), (to_id, to_coords.0, to_coords.1));
                    }
                }
            }
        }

        Ok(graph)
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self).unwrap()
    }

    /// Helper function add edge to the list with weight
    fn add_edge(&mut self, from: u64, to: u64, weight: f32) {
        self.adj_list
            .entry(from)
            .or_insert_with(|| Vec::new())
            .push((to, weight));
    }

    /// This takes two points and add edge for only from -> to
    /// Point here is a tuple with the node id, lat and long
    pub fn add_edge_one_way(&mut self, from: (u64, f64, f64), to: (u64, f64, f64)) {
        let distance_km = Graph::calculate_distance((from.1, from.2), (to.1, to.2));
        self.add_edge(from.0, to.0, distance_km);
    }

    /// This takes two points and adds edge for from <-> to
    /// Point here is a tuple with the node id, lat and long
    pub fn add_edge_two_way(&mut self, from: (u64, f64, f64), to: (u64, f64, f64)) {
        let distance_km = Graph::calculate_distance((from.1, from.2), (to.1, to.2));
        self.add_edge(from.0, to.0, distance_km);
        self.add_edge(to.0, from.0, distance_km);
    }


    /// Calculates the distance in `km` using `Harvesine` formula
    /// Uses latutide and longitude of two point and returns the distance
    fn calculate_distance(p1: (f64, f64), p2: (f64, f64)) -> f32 {
        // radius in km
        const RADIUS: f64 = 6371.0;
        let (lat1, lon1) = p1;
        let (lat2, lon2) = p2;
        
        let lat1_rad = lat1.to_radians();
        let lat2_rad = lat2.to_radians();
        let lat_delta_rad = (lat2 - lat1).to_radians();
        let lon_delta_rad = (lon2 - lon1).to_radians();
        // angle
        let a = (lat_delta_rad / 2.0).sin().powi(2) + 
                lat1_rad.cos() * lat2_rad.cos() *
                (lon_delta_rad / 2.0).sin().powi(2);
        // central angle
        let c = 2.0 * (a.sqrt().atan2((1.0 - a).sqrt()));
        
        (((RADIUS * c) * 1000.0).round() / 1000.0) as f32
    }
}