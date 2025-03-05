use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Operador {
    pub id: i64,
    pub nome: String,
    pub senha: String,
}