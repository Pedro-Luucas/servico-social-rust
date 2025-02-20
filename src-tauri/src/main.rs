use tauri::Manager;
use sqlx::PgPool;
use std::env;

mod models;
mod repositories;
mod services;
mod handlers;
mod dtos;

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv::dotenv().ok();

    // Retrieve DATABASE_URL from environment variables
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");

    // Connect to the database
    let pool = PgPool::connect(&database_url).await.expect("Failed to connect to the database");

    // Start Tauri application
    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            handlers::usuario_handler::create_usuario,
            handlers::usuario_handler::get_usuario_by_id
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}