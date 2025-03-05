use crate::models::operador::Operador;
use sqlx::PgPool;

pub struct OperadorRepository;

impl OperadorRepository {
    pub async fn save(pool: &PgPool, operador: &Operador) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            INSERT INTO operadores (id, nome, senha)
            VALUES ($1, $2, $3)
            "#,
            operador.id,
            operador.nome,
            operador.senha
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    pub async fn get_next_id(pool: &PgPool) -> Result<i64, sqlx::Error> {
        let result = sqlx::query!(
            r#"
            SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM operadores
            "#
        )
        .fetch_one(pool)
        .await?;

        // Fix: Unwrap the Option<i64> with a default value of 0 if None
        Ok(result.next_id.unwrap_or(0))
    }

    pub async fn find_by_credentials(
        pool: &PgPool,
        nome: &str,
        senha: &str,
    ) -> Result<Option<i64>, sqlx::Error> {
        let result = sqlx::query!(
            r#"
            SELECT id
            FROM operadores
            WHERE nome = $1 AND senha = $2
            "#,
            nome,
            senha
        )
        .fetch_optional(pool)
        .await?;

        Ok(result.map(|r| r.id))
    }
}
