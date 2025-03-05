use sqlx::PgPool;
use crate::models::operador::Operador;
use crate::dtos::create_operador_dto::CreateOperadorDto;
use crate::repositories::operador_repository::OperadorRepository;
use crate::dtos::login_operador_dto::LoginOperadorDto;

pub struct OperadorService;

impl OperadorService {
    pub async fn create_operador(pool: &PgPool, dto: CreateOperadorDto) -> Result<i64, sqlx::Error> {
        let id = OperadorRepository::get_next_id(pool).await?;
        
        let operador = Operador {
            id,
            nome: dto.nome,
            senha: dto.senha,
        };

        OperadorRepository::save(pool, &operador).await?;
        
        Ok(id)
    }
    
    pub async fn login_operador(pool: &PgPool, dto: LoginOperadorDto) -> Result<i64, sqlx::Error> {
        let maybe_id = OperadorRepository::find_by_credentials(pool, &dto.nome, &dto.senha).await?;
        
        match maybe_id {
            Some(id) => Ok(id),
            None => Err(sqlx::Error::RowNotFound)
        }
    }
}