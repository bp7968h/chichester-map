use std::{
    collections::HashMap,
    fs::File,
    io::BufReader,
};

use quick_xml::{events::Event, Reader};
use serde::{Deserialize, Serialize};

/// Represents a `bound` in the OSM file
#[derive(Debug, Default, Serialize, Deserialize)]
struct Bound {
    minlat: f64,
    maxlat: f64,
    minlon: f64,
    maxlon: f64,
}

/// Represents a `node` in the OSM file
#[derive(Debug, Default, Serialize, Deserialize)]
struct Node {
    id: u64,
    lat: f64,
    lon: f64,
    tags: HashMap<String, String>,
}

/// Represents a `way` in the OSM file
#[derive(Debug, Default, Serialize, Deserialize)]
struct Way {
    id: u64,
    nodes: Vec<u64>,
    tags: HashMap<String, String>,
}

/// Represents a `member` of a relation
#[derive(Debug, Default, Serialize, Deserialize)]
struct RelationMember {
    _type: String,
    ref_id: u64,
    role: String,
}

/// Represents a `relation` in OSM file
#[derive(Debug, Default, Serialize, Deserialize)]
struct Relation {
    id: u64,
    members: Vec<RelationMember>,
    tags: HashMap<String, String>,
}

/// Tracks which block are we in
#[derive(Debug)]
enum BlockType {
    Node,
    Way,
    Relation,
}

fn main() {
    let osm_file = File::open("test.osm").expect("Failed to open OSM file");
    let mut reader = Reader::from_reader(BufReader::new(osm_file));
    reader.config_mut().trim_text(true);
    let mut buf = Vec::new();

    let mut bounds: Bound = Bound::default();
    let mut nodes: Vec<Node> = Vec::new();
    let mut ways: Vec<Way> = Vec::new();
    let mut relations: Vec<Relation> = Vec::new();

    let mut current_block: Option<BlockType> = None;
    let mut curr_node = Node::default();
    let mut curr_way = Way::default();
    let mut curr_relation = Relation::default();

    loop {
        match reader.read_event_into(&mut buf) {
            Err(e) => panic!("Error at position {}: {:?}", reader.error_position(), e),
            Ok(Event::Eof) => break,
            Ok(Event::Empty(e)) => match e.name().as_ref() {
                b"bounds" => {
                    for attr in e.attributes().flatten() {
                        let value = std::str::from_utf8(&attr.value)
                            .expect("Failed to parse `bound attribute` string")
                            .parse()
                            .unwrap_or(0.0);
                        match attr.key.as_ref() {
                            b"minlat" => bounds.minlat = value,
                            b"minlon" => bounds.minlon = value,
                            b"maxlat" => bounds.maxlat = value,
                            b"maxlon" => bounds.maxlon = value,
                            _ => {}
                        }
                    }
                }
                b"node" => {
                    let mut node = Node::default();
                    for attr in e.attributes().flatten() {
                        let value = std::str::from_utf8(&attr.value)
                            .expect("Failed to parse `node attribute` string");
                        match attr.key.as_ref() {
                            b"id" => node.id = value.parse().unwrap_or(0),
                            b"lat" => node.lat = value.parse().unwrap_or(0.0),
                            b"lon" => node.lon = value.parse().unwrap_or(0.0),
                            _ => {}
                        }
                    }
                    nodes.push(node);
                }
                b"tag" => todo!(),
                b"nd" => todo!(),
                b"member" => todo!(),
                others => eprintln!(
                    "Some empty tag found, check if it needs to be handeled: [{}]",
                    std::str::from_utf8(others).unwrap()
                ),
            },
            Ok(Event::Start(e)) => match e.name().as_ref() {
                b"node" => {
                    current_block = Some(BlockType::Node);
                    todo!()
                }
                b"way" => {
                    current_block = Some(BlockType::Way);
                    todo!()
                }
                b"relation" => {
                    current_block = Some(BlockType::Relation);
                    todo!()
                }
                _ => todo!(),
            },
            Ok(Event::End(_)) => {
                if let Some(block) = &current_block {
                    match block {
                        BlockType::Node => {
                            nodes.push(curr_node);
                            curr_node = Node::default();
                        }
                        BlockType::Way => {
                            ways.push(curr_way);
                            curr_way = Way::default();
                        }
                        BlockType::Relation => {
                            relations.push(curr_relation);
                            curr_relation = Relation::default();
                        }
                    }
                }
                current_block = None;
            }
            _ => (),
        }
        buf.clear();
    }

    // println!("✅ Parsed {} nodes and {} ways", nodes.len(), ways.len());

    // 🚀 **Filter Nodes: Keep only referenced ones or those with tags**
    // let filtered_nodes: Vec<&Node> = nodes.values()
    //     .filter(|node| !node.tags.is_empty() || referenced_nodes.contains(&node.id))
    //     .collect();

    // // 🚀 **Save extracted data as JSON**
    // let json = serde_json::json!({
    //     "nodes": filtered_nodes,
    //     "ways": ways,
    // });

    // std::fs::write("chichester_city.json", serde_json::to_string_pretty(&json).unwrap()).unwrap();
    // println!("✅ Successfully saved to chichester_city.json!");
}
