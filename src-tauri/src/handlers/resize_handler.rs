use crate::resize::resize::resize_window;
use tauri::{command, Window};

#[command]
pub fn resize_current_window(window: Window, width: f64, height: f64) -> Result<(), String> {
    resize_window(window, width, height)
}

#[command]
pub fn get_screen_size(window: Window) -> Result<serde_json::Value, String> {
    match window.current_monitor() {
        Ok(Some(monitor)) => {
            let size = monitor.size();
            let json = serde_json::json!({
                "width": size.width as f64,
                "height": size.height as f64
            });
            Ok(json)
        },
        Ok(None) => Err("No monitor found".to_string()),
        Err(e) => Err(format!("Failed to get monitor: {}", e))
    }
}
