use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Registro {
    pub id: Uuid,
    pub usuario_id: Uuid,
    pub data_atendimento: DateTime<Utc>,
    pub registro: String,
    pub operador_id: Option<i64>,
}
