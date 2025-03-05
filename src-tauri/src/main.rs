use sqlx::PgPool;
use std::env;

mod models;
mod repositories;
mod services;
mod dtos;
mod resize;
mod handlers;

#[tokio::main]
async fn main() {
    // Load environment variables from .env file
    dotenv::dotenv().ok();

    // Retrieve DATABASE_URL from environment variables
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set in .env");

    // Connect to the database with error handling
    // In your main.rs, you can add more detailed error handling
let pool = match PgPool::connect(&database_url).await {
    Ok(pool) => {
        println!("Successfully connected to the database");
        pool
    },
    Err(err) => {
        eprintln!("Failed to connect to the database: {}", err);
        eprintln!(" Using connection string: {}", database_url);
        std::process::exit(1);
    }
};

    // Start Tauri application
    tauri::Builder::default()
        .manage(pool)
        .invoke_handler(tauri::generate_handler![
            
            handlers::resize_handler::resize_current_window,

            handlers::operador_handler::create_operador,
            handlers::operador_handler::login_operador,

            handlers::usuario_handler::create_usuario,
            handlers::usuario_handler::edit_usuario,

            handlers::usuario_handler::get_usuario_by_id,
            handlers::usuario_handler::get_usuario_by_nome,
            handlers::usuario_handler::get_usuario_by_telefone,
            handlers::usuario_handler::get_usuario_by_cep,
            handlers::usuario_handler::get_usuario_by_cpf,

            handlers::registro_handler::create_registro,
            handlers::registro_handler::get_registro_by_id,
            handlers::registro_handler::get_registros_by_usuario_id,
            handlers::registro_handler::delete_registro,

        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}