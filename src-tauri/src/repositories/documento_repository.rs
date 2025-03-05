use crate::models::documento::Documento;
use sqlx::PgPool;
use uuid::Uuid;

pub struct DocumentoRepository;

impl DocumentoRepository {
    pub async fn save(pool: &PgPool, documento: &Documento) -> Result<(), sqlx::Error> {
        sqlx::query!(
            r#"
            INSERT INTO documentos (
                id, usuario_id, data_upload, documento, operador_id, file_name, file_type
            )
            VALUES (
                $1, $2, $3, $4, $5, $6, $7
            )
            "#,
            documento.id,
            documento.usuario_id,
            documento.data_upload,
            documento.documento,
            documento.operador_id,
            documento.file_name,
            documento.file_type
        )
        .execute(pool)
        .await?;

        Ok(())
    }

    pub async fn find_by_id(pool: &PgPool, id: Uuid) -> Result<Documento, sqlx::Error> {
        let documento = sqlx::query_as!(
            Documento,
            r#"
            SELECT 
                id, usuario_id, data_upload, documento, operador_id, file_name, file_type
            FROM documentos
            WHERE id = $1
            "#,
            id
        )
        .fetch_one(pool)
        .await?;

        Ok(documento)
    }

    pub async fn find_by_usuario_id(
        pool: &PgPool,
        usuario_id: Uuid,
    ) -> Result<Vec<Documento>, sqlx::Error> {
        let documentos = sqlx::query_as!(
            Documento,
            r#"
            SELECT 
                id, usuario_id, data_upload, documento, operador_id, file_name, file_type
            FROM documentos
            WHERE usuario_id = $1
            ORDER BY data_upload DESC
            "#,
            usuario_id
        )
        .fetch_all(pool)
        .await?;

        Ok(documentos)
    }

    pub async fn delete_by_id(pool: &PgPool, id: Uuid) -> Result<bool, sqlx::Error> {
        let result = sqlx::query!("DELETE FROM documentos WHERE id = $1", id)
            .execute(pool)
            .await?;

        Ok(result.rows_affected() > 0)
    }
}
