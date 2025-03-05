use crate::resize::resize::resize_window;
use tauri::{command, Window};

#[command]
pub fn resize_current_window(window: Window, width: f64, height: f64) -> Result<(), String> {
    resize_window(window, width, height)
}
