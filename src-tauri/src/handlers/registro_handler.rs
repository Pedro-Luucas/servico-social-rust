use tauri::State;
use uuid::Uuid;
use crate::models::registro::Registro;
use crate::services::registro_service::RegistroService;
use crate::dtos::create_registro_dto::CreateRegistroDto;
use sqlx::PgPool;

#[tauri::command]
pub async fn create_registro(pool: State<'_, PgPool>, dto: CreateRegistroDto) -> Result<String, String> {
    RegistroService::create_registro(&pool, dto)
        .await
        .map(|id| id.to_string())
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_registro_by_id(pool: State<'_, PgPool>, id: String) -> Result<Registro, String> {
    let uuid = Uuid::parse_str(&id).map_err(|e| e.to_string())?;
    RegistroService::get_registro_by_id(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_registros_by_usuario_id(pool: State<'_, PgPool>, usuario_id: String) -> Result<Vec<Registro>, String> {
    let uuid = Uuid::parse_str(&usuario_id).map_err(|e| e.to_string())?;
    RegistroService::get_registros_by_usuario_id(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_registro(pool: State<'_, PgPool>, id: String) -> Result<bool, String> {
    let uuid = Uuid::parse_str(&id).map_err(|e| e.to_string())?;
    RegistroService::delete_registro(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}