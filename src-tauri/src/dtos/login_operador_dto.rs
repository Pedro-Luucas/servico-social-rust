use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct LoginOperadorDto {
    pub nome: String,
    pub senha: String,
}