use std::{
    cmp::Reverse,
    collections::{BinaryHeap, HashMap},
    error::Error,
    fs::File,
    io::BufReader,
};

use ordered_float::OrderedFloat;
use serde::{Deserialize, Serialize};

use crate::osm_data::OSMData;

/// This represents the weighted graph
/// Where each will have a id of the node as the key
/// And the tuple with another node id and the calculated distance
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Graph {
    adj_list: HashMap<u64, Vec<(u64, f32)>>,
}

impl Graph {
    pub fn new() -> Self {
        Graph {
            ..Default::default()
        }
    }

    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(&self).unwrap()
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

    pub(crate) fn from_osm_data(osm_data: OSMData) -> Result<Self, Box<dyn Error>> {
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

                if let (Some(&from_coords), Some(&to_coords)) =
                    (node_map.get(&from_id), node_map.get(&to_id))
                {
                    if is_oneway {
                        graph.add_edge_one_way(
                            (from_id, from_coords.0, from_coords.1),
                            (to_id, to_coords.0, to_coords.1),
                        );
                    } else {
                        graph.add_edge_two_way(
                            (from_id, from_coords.0, from_coords.1),
                            (to_id, to_coords.0, to_coords.1),
                        );
                    }
                }
            }
        }

        Ok(graph)
    }

    /// This function uses the path given as argument, to construct the graph using json file
    /// Identifies if it is one way or two way using the tag in the way
    pub fn from_json_file(path: &str) -> Result<Self, Box<dyn Error>> {
        let file = File::open(path)?;
        let reader = BufReader::new(file);

        let osm_data: OSMData = serde_json::from_reader(reader)?;

        Self::from_osm_data(osm_data)
    }

    pub fn find_shortest_path(&self, start: u64, end: u64) -> Vec<u64> {
        let mut distances: HashMap<u64, f32> = HashMap::new();
        let mut predecessors: HashMap<u64, u64> = HashMap::new();
        let mut heap: BinaryHeap<Reverse<(OrderedFloat<f32>, u64)>> = BinaryHeap::new();

        for &node in self.adj_list.keys() {
            if node == start {
                distances.insert(start, 0.0);
            } else {
                distances.insert(node, f32::MAX);
            }
        }
        heap.push(Reverse((OrderedFloat(0.0), start)));

        while let Some(Reverse((cost, node))) = heap.pop() {
            if node == end {
                break;
            }

            if cost > OrderedFloat(distances[&node]) {
                continue;
            }

            if let Some(neighbours) = self.adj_list.get(&node) {
                for &(neighbour, weight) in neighbours {
                    let new_cost = cost + weight;
                    if new_cost < OrderedFloat(*distances.get(&neighbour).unwrap_or(&f32::MAX)) {
                        distances.insert(neighbour, new_cost.into_inner());
                        predecessors.insert(neighbour, node);
                        heap.push(Reverse((new_cost, neighbour)));
                    }
                }
            }
        }
        let mut path = Vec::new();
        let mut current = end;

        while let Some(&prev) = predecessors.get(&current) {
            path.push(current);
            current = prev;
        }

        if path.is_empty() && start != end {
            return vec![];
        }

        path.push(start);
        path.reverse();
        path
    }

    /// Helper function add edge to the list with weight
    fn add_edge(&mut self, from: u64, to: u64, weight: f32) {
        self.adj_list
            .entry(from)
            .or_insert_with(|| Vec::new())
            .push((to, weight));
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
        let a = (lat_delta_rad / 2.0).sin().powi(2)
            + lat1_rad.cos() * lat2_rad.cos() * (lon_delta_rad / 2.0).sin().powi(2);
        // central angle
        let c = 2.0 * (a.sqrt().atan2((1.0 - a).sqrt()));

        (((RADIUS * c) * 1000.0).round() / 1000.0) as f32
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_shortest_path() {
        let mut graph = Graph::new();
        // 5km
        graph.add_edge_two_way((1, 51.5074, 0.1278), (2, 51.5074, 0.20005));
        // 10km
        graph.add_edge_two_way((2, 51.5074, 0.1278), (3, 51.5074, 0.27230));
        // 1.92km
        graph.add_edge_two_way((1, 51.5074, 0.1278), (4, 51.5074, 0.100000));
        // 3.004km
        graph.add_edge_two_way((4, 51.5074, 0.1278), (5, 51.5074, 0.1712));
        // 1.26km
        graph.add_edge_two_way((2, 51.5074, 0.1278), (5, 51.5074, 0.11008));

        assert_eq!(graph.find_shortest_path(1, 3), vec![1, 2, 3]);
        assert_eq!(graph.find_shortest_path(1, 5), vec![1, 4, 5]);
        assert_eq!(graph.find_shortest_path(3, 5), vec![3, 2, 5]);
        assert_eq!(graph.find_shortest_path(1, 4), vec![1, 4]);
        assert_eq!(graph.find_shortest_path(1, 1), vec![1]);
        assert_eq!(graph.find_shortest_path(3, 4), vec![3, 2, 5, 4]);
    }

    #[test]
    fn test_shortest_path_no_path() {
        let mut graph = Graph::new();
        // 5km
        graph.add_edge_two_way((1, 51.5074, 0.1278), (2, 51.5074, 0.20005));
        // 5km
        graph.add_edge_one_way((1, 51.5074, 0.1278), (4, 51.5074, 0.20005));
        // 1.26km
        graph.add_edge_one_way((4, 51.5074, 0.1278), (3, 51.5074, 0.11008));
        // 10km
        graph.add_edge_one_way((2, 51.5074, 0.1278), (3, 51.5074, 0.27230));
        // 5km
        graph.add_edge_one_way((3, 51.5074, 0.1278), (5, 51.5074, 0.20005));

        assert_eq!(graph.find_shortest_path(1, 3), vec![1, 4, 3]);
        assert_eq!(graph.find_shortest_path(3, 1), Vec::<u64>::new());
    }
}
