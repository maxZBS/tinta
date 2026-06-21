use tauri::Manager;
use tauri_plugin_fs::FsExt;

/// Grant runtime access to a directory the user picked. Both the `fs:scope` and
/// the asset-protocol scope are static config and can't name a runtime path, so
/// the chosen storage folder is allowed here instead — for reading/writing note
/// files (fs) and for loading note images via `convertFileSrc` (asset). Called
/// right after the user picks, and again on boot from the persisted path.
///
/// `recursive: true` covers the folder and everything beneath it (notes, the
/// `trash` subfolder, and `<id>/attachments`). Note: the trash folder is NOT
/// dot-prefixed precisely because the recursive `**` glob skips hidden entries.
#[tauri::command]
pub fn allow_storage_dir(app: tauri::AppHandle, path: String) -> Result<(), String> {
    app.fs_scope()
        .allow_directory(&path, true)
        .map_err(|error| error.to_string())?;

    app.asset_protocol_scope()
        .allow_directory(&path, true)
        .map_err(|error| error.to_string())?;

    Ok(())
}