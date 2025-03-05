use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct UploadDocumentoDto {
    pub usuario_id: String,
    pub documento: Vec<u8>,
    pub file_name: String,
    pub file_type: String,
    pub operador_id: Option<i64>,
}
