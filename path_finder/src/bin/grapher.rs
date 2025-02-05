use std::{env, process};

use path_finder::Graph;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: ./path_finder <json_file>");
        process::exit(1);
    }
    let json_file_path = &args[1];

    let graph = Graph::from_json_file(json_file_path).expect("Failed to parse json to graph");
    println!("{:#?}", graph);
}
