use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct CreateOperadorDto {
    pub nome: String,
    pub senha: String,
}