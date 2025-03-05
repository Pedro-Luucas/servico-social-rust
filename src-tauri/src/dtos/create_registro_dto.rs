use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CreateRegistroDto {
    pub usuario_id: Uuid,
    pub registro: String,
    pub operador_id: Option<i64>,
}
