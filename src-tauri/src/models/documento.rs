use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Documento {
    pub id: Uuid,
    pub usuario_id: Uuid,
    pub data_upload: DateTime<Utc>,
    pub documento: Vec<u8>, // Binary content of the document
    pub operador_id: Option<i64>,
    pub file_name: String,
    pub file_type: String,
}
