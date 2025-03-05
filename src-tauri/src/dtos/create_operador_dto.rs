use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CreateOperadorDto {
    pub nome: String,
    pub senha: String,
}
