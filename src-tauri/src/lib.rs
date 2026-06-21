mod commands;

use tauri::{LogicalSize, Manager, WindowEvent};
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

/// Sane floor for the restored window — matches `minHeight`/`minWidth` in
/// tauri.conf.json. The window-state plugin can persist a corrupt size on
/// multi-monitor / HiDPI moves (mixing physical and logical pixels), which
/// makes the window come back tiny. If the restored size falls below this, we
/// reset it to a comfortable default instead of trusting the bad value.
const MIN_RESTORED_WIDTH: f64 = 720.0;
const MIN_RESTORED_HEIGHT: f64 = 400.0;
const DEFAULT_WIDTH: f64 = 1447.0;
const DEFAULT_HEIGHT: f64 = 942.0;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let mut builder = tauri::Builder::default();

    // The updater plugin is desktop-only (not available on mobile targets).
    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                ensure_sane_window_size(&window);
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            // The plugin only flushes state to disk on RunEvent::Exit, which a
            // dev-server SIGINT or an abnormal quit never reaches — so position
            // and size were lost. Persist on close so it survives any exit.
            if let WindowEvent::CloseRequested { .. } = event {
                let _ = window.app_handle().save_window_state(StateFlags::all());
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::pdf::export_pdf_from_html,
            commands::storage::allow_storage_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

/// Clamp the window to a usable size after the window-state plugin restores it,
/// guarding against a corrupt persisted size collapsing the window.
fn ensure_sane_window_size(window: &tauri::WebviewWindow) {
    let scale = window.scale_factor().unwrap_or(1.0);

    let Ok(physical) = window.inner_size() else {
        return;
    };

    let logical = physical.to_logical::<f64>(scale);

    if logical.width >= MIN_RESTORED_WIDTH && logical.height >= MIN_RESTORED_HEIGHT {
        return;
    }

    let _ = window.set_size(LogicalSize::new(DEFAULT_WIDTH, DEFAULT_HEIGHT));
    let _ = window.center();
}
