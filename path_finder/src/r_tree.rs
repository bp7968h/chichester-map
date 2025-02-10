use rstar::{RTreeObject, AABB, PointDistance};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NodePoint {
    pub id: u64,
    pub lat: f64,
    pub lon: f64,
}

impl RTreeObject for NodePoint {
    type Envelope = AABB<[f64; 2]>;

    fn envelope(&self) -> Self::Envelope {
        AABB::from_point([self.lat, self.lon])
    }
}

impl PointDistance for NodePoint {
    fn distance_2(&self, point: &[f64; 2]) -> f64 {
        ((self.lat - point[0]).powi(2) + (self.lon - point[1]).powi(2)).sqrt()
    }
}