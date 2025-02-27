use tauri::State;
use uuid::Uuid;
use crate::models::usuario::Usuario;
use crate::services::usuario_service::UsuarioService;
use crate::dtos::create_usuario_dto::CreateUsuarioDto;
use sqlx::PgPool;

#[tauri::command]
pub async fn create_usuario(pool: State<'_, PgPool>, dto: CreateUsuarioDto) -> Result<(), String> {
    UsuarioService::create_usuario(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_usuario_by_id(pool: State<'_, PgPool>, id: String) -> Result<Usuario, String> {
    let uuid = Uuid::parse_str(&id).map_err(|e| e.to_string())?;
    UsuarioService::get_usuario_by_id(&pool, uuid)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_usuario_by_nome(pool: State<'_, PgPool>, nome: String) -> Result<Vec<Usuario>, String> {
    UsuarioService::get_usuario_by_nome(&pool, &nome)
        .await
        .map_err(|e| e.to_string())
}