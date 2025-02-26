use tauri::{command, Window};
use crate::resize::resize::resize_window;

#[command]
pub fn resize_current_window(window: Window, width: f64, height: f64) -> Result<(), String> {
    resize_window(window, width, height)
}