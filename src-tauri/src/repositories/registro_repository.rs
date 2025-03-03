use sqlx::PgPool;
use uuid::Uuid;
use crate::models::registro::Registro;

pub struct RegistroRepository;

impl RegistroRepository {
    pub async fn save(pool: &PgPool, registro: &Registro) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            INSERT INTO registros (
                id, usuario_id, data_atendimento, registro, operador_id
            )
            VALUES (
                $1, $2, $3, $4, $5
            )
            "#,
            registro.id,
            registro.usuario_id,
            registro.data_atendimento,
            registro.registro,
            registro.operador_id
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Registro, sqlx::Error> {
        let registro = sqlx::query_as!(
            Registro,
            r#"
            SELECT 
                id, usuario_id, data_atendimento, registro, operador_id
            FROM registros
            WHERE id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(registro)
    }

    pub async fn find_by_usuario_id(pool: &PgPool, usuario_id: Uuid) -> Result<Vec<Registro>, sqlx::Error> {
        let registros = sqlx::query_as!(
            Registro,
            r#"
            SELECT 
                id, usuario_id, data_atendimento, registro, operador_id
            FROM registros
            WHERE usuario_id = $1
            ORDER BY data_atendimento DESC
            "#,
            usuario_id
        )
        .fetch_all(pool)
        .await?;

        Ok(registros)
    }

    pub async fn delete_by_id(pool: &PgPool, id: Uuid) -> Result<bool, sqlx::Error> {
        let result = sqlx::query!("DELETE FROM registros WHERE id = $1", id)
            .execute(pool)
            .await?;
        
        Ok(result.rows_affected() > 0)
    }
}
