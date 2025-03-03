use serde::{Serialize, Deserialize};
use uuid::Uuid;
use chrono::{DateTime, Utc}; 

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Registro {
    pub id: Uuid,
    pub usuario_id: Uuid,
    pub data_atendimento: DateTime<Utc>,
    pub registro: String,
    pub operador_id: Option<i64>,
}
