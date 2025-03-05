use crate::dtos::create_operador_dto::CreateOperadorDto;
use crate::dtos::login_operador_dto::LoginOperadorDto;
use crate::services::operador_service::OperadorService;
use sqlx::PgPool;
use tauri::State;

#[tauri::command]
pub async fn create_operador(
    pool: State<'_, PgPool>,
    dto: CreateOperadorDto,
) -> Result<i64, String> {
    OperadorService::create_operador(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn login_operador(pool: State<'_, PgPool>, dto: LoginOperadorDto) -> Result<i64, String> {
    OperadorService::login_operador(&pool, dto)
        .await
        .map_err(|e| e.to_string())
}
