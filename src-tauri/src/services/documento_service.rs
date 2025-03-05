use crate::models::documento::Documento;
use crate::repositories::documento_repository::DocumentoRepository;
use chrono::Utc;
use sqlx::PgPool;
use uuid::Uuid;

pub struct DocumentoService;

impl DocumentoService {
    pub async fn upload_documento(
        pool: &PgPool,
        usuario_id: Uuid,
        documento: Vec<u8>,
        file_name: String,
        file_type: String,
        operador_id: Option<i64>,
    ) -> Result<Uuid, sqlx::Error> {
        let id = Uuid::new_v4();
        let documento_record = Documento {
            id,
            usuario_id,
            data_upload: Utc::now(),
            documento,
            operador_id,
            file_name,
            file_type,
        };

        DocumentoRepository::save(pool, &documento_record).await?;

        Ok(id)
    }

    pub async fn get_documento_by_id(pool: &PgPool, id: Uuid) -> Result<Documento, sqlx::Error> {
        DocumentoRepository::find_by_id(pool, id).await
    }

    pub async fn get_documentos_by_usuario_id(
        pool: &PgPool,
        usuario_id: Uuid,
    ) -> Result<Vec<Documento>, sqlx::Error> {
        DocumentoRepository::find_by_usuario_id(pool, usuario_id).await
    }

    pub async fn delete_documento(pool: &PgPool, id: Uuid) -> Result<bool, sqlx::Error> {
        DocumentoRepository::delete_by_id(pool, id).await
    }
}
