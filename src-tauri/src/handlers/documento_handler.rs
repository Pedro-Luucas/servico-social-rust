use crate::dtos::upload_documento_dto::UploadDocumentoDto;
use crate::models::documento::Documento;
use crate::services::documento_service::DocumentoService;
use sqlx::PgPool;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub async fn upload_documento(
    pool: State<'_, PgPool>,
    dto: UploadDocumentoDto,
) -> Result<String, String> {
    let usuario_id = Uuid::parse_str(&dto.usuario_id).map_err(|e| e.to_string())?;

    DocumentoService::upload_documento(
        &pool,
        usuario_id,
        dto.documento,
        dto.file_name,
        dto.file_type,
        dto.operador_id,
    )
    .await
    .map(|id| id.to_string())
    .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_documento_by_id(pool: State<'_, PgPool>, id: String) -> Result<Documento, String> {
    let uuid = Uuid::parse_str(&id).map_err(|e| e.to_string())?;
    DocumentoService::get_documento_by_id(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_documentos_by_usuario_id(
    pool: State<'_, PgPool>,
    usuario_id: String,
) -> Result<Vec<Documento>, String> {
    let uuid = Uuid::parse_str(&usuario_id).map_err(|e| e.to_string())?;
    DocumentoService::get_documentos_by_usuario_id(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_documento(pool: State<'_, PgPool>, id: String) -> Result<bool, String> {
    let uuid = Uuid::parse_str(&id).map_err(|e| e.to_string())?;
    DocumentoService::delete_documento(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}
