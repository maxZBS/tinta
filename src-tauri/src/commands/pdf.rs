use printpdf::{Base64OrRaw, GeneratePdfOptions, PdfDocument, PdfSaveOptions};
use std::collections::BTreeMap;
use std::fs;
use std::path::PathBuf;

/// Async + spawn_blocking so the CPU-heavy HTML->PDF render and font embedding
/// run off the main thread; a sync command would freeze the whole UI (and the
/// export progress bar) for the duration of the render.
#[tauri::command]
pub async fn export_pdf_from_html(path: String, html: String) -> Result<(), String> {
    tauri::async_runtime::spawn_blocking(move || {
        let output_path = PathBuf::from(path);
        validate_pdf_path(&output_path)?;

        let pdf = render_pdf(&html)?;
        fs::write(output_path, pdf).map_err(|error| error.to_string())
    })
    .await
    .map_err(|error| error.to_string())?
}

fn validate_pdf_path(path: &PathBuf) -> Result<(), String> {
    let extension = path.extension().and_then(|value| value.to_str());
    if extension != Some("pdf") {
        return Err("Export path must end with .pdf".to_string());
    }

    let parent = path
        .parent()
        .ok_or_else(|| "Export path must include a parent folder.".to_string())?;
    if !parent.exists() {
        return Err("Export folder does not exist.".to_string());
    }

    Ok(())
}

fn render_pdf(html: &str) -> Result<Vec<u8>, String> {
    let mut warnings = Vec::new();
    let images = collect_html_images(html);
    let options = GeneratePdfOptions {
        font_embedding: Some(true),
        page_width: Some(210.0),
        page_height: Some(297.0),
        margin_top: Some(0.0),
        margin_right: Some(0.0),
        margin_bottom: Some(0.0),
        margin_left: Some(0.0),
        show_page_numbers: Some(false),
        ..GeneratePdfOptions::default()
    };

    let document = PdfDocument::from_html(
        html,
        &images,
        &BTreeMap::new(),
        &options,
        &mut warnings,
    )
    .map_err(|error| error.to_string())?;

    Ok(document.save(&PdfSaveOptions::default(), &mut warnings))
}

fn collect_html_images(html: &str) -> BTreeMap<String, Base64OrRaw> {
    let mut images = BTreeMap::new();

    collect_quoted_sources(html, "src=\"", '"', &mut images);
    collect_quoted_sources(html, "src='", '\'', &mut images);

    images
}

fn collect_quoted_sources(
    html: &str,
    marker: &str,
    quote: char,
    images: &mut BTreeMap<String, Base64OrRaw>,
) {
    let mut rest = html;

    while let Some(start) = rest.find(marker) {
        let source_start = start + marker.len();
        let after_marker = &rest[source_start..];

        let Some(source_end) = after_marker.find(quote) else {
            break;
        };

        let source = &after_marker[..source_end];
        if let Some(path) = file_url_to_path(source) {
            if let Ok(bytes) = fs::read(path) {
                images.insert(source.to_string(), Base64OrRaw::Raw(bytes));
            }
        }

        rest = &after_marker[source_end..];
    }
}

fn file_url_to_path(source: &str) -> Option<PathBuf> {
    let encoded_path = source.strip_prefix("file://")?;

    Some(PathBuf::from(percent_decode(encoded_path)))
}

fn percent_decode(value: &str) -> String {
    let mut output = String::new();
    let bytes = value.as_bytes();
    let mut index = 0;

    while index < bytes.len() {
        if bytes[index] == b'%' && index + 2 < bytes.len() {
            if let Ok(hex) = u8::from_str_radix(&value[index + 1..index + 3], 16) {
                output.push(hex as char);
                index += 3;
                continue;
            }
        }

        output.push(bytes[index] as char);
        index += 1;
    }

    output
}

#[cfg(test)]
mod tests {
    use super::render_pdf;

    #[test]
    fn renders_html_to_pdf_bytes() {
        let pdf = render_pdf(
            r#"<!doctype html>
            <html>
              <body>
                <h1>Tinta</h1>
                <p>Premium violet export test.</p>
              </body>
            </html>"#,
        )
        .expect("html should render to pdf");

        assert!(pdf.starts_with(b"%PDF"));
    }
}
