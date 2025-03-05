use tauri::{LogicalSize, Window};

pub fn resize_window(window: Window, width: f64, height: f64) -> Result<(), String> {
    match window.set_size(LogicalSize::new(width, height)) {
        Ok(_) => Ok(()),
        Err(e) => Err(format!("Failed to resize window: {}", e)),
    }
}
