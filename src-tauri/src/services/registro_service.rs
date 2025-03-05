use crate::dtos::create_registro_dto::CreateRegistroDto;
use crate::models::registro::Registro;
use crate::repositories::registro_repository::RegistroRepository;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

pub struct RegistroService;

impl RegistroService {
    pub async fn create_registro(
        pool: &PgPool,
        dto: CreateRegistroDto,
    ) -> Result<Uuid, sqlx::Error> {
        let id = Uuid::new_v4();
        let registro = Registro {
            id,
            usuario_id: dto.usuario_id,
            data_atendimento: Utc::now(),
            registro: dto.registro,
            operador_id: dto.operador_id,
        };

        RegistroRepository::save(pool, &registro).await?;

        Ok(id)
    }

    pub async fn get_registro_by_id(pool: &PgPool, id: Uuid) -> Result<Registro, sqlx::Error> {
        RegistroRepository::find_by_id(pool, id).await
    }

    pub async fn get_registros_by_usuario_id(
        pool: &PgPool,
        usuario_id: Uuid,
    ) -> Result<Vec<Registro>, sqlx::Error> {
        RegistroRepository::find_by_usuario_id(pool, usuario_id).await
    }

    pub async fn delete_registro(pool: &PgPool, id: Uuid) -> Result<bool, sqlx::Error> {
        RegistroRepository::delete_by_id(pool, id).await
    }
}
