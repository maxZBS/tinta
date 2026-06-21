import { NOTE_PDF_CONTENT_STYLE } from "@/lib/note-pdf-content-style.const";

/* The PDF is rendered by printpdf's HTML engine (Rust), not a browser. It has
   no flexbox and mislays multiple inline-blocks on a line, so the meta row is a
   <table>. Fonts: the app is sans-serif everywhere, so headings/body use a
   sans-serif stack — never serif. Colors mirror the dark editor view. */
export const NOTE_PDF_STYLE = `
@page {
  size: A4;
  margin: 20mm 22mm;
}

html,
body {
  margin: 0;
  background: #100d17;
  color: #f0ecf8;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px;
  line-height: 1.58;
}

.pdf-shell {
  margin: 0;
}

.cover {
  margin: 0 0 26px;
  padding: 4px 0 20px;
  border-bottom: 1px solid #2b2340;
}

.brand {
  margin: 0 0 16px;
  color: #a78bfa;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.title {
  margin: 0 0 14px;
  color: #f0ecf8;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.12;
}

.tags {
  margin: 0 0 18px;
}

.tag {
  display: inline-block;
  margin: 0 6px 6px 0;
  padding: 4px 10px;
  border-radius: 6px;
  background: #221c2f;
  color: #d8c9ff;
  font-size: 11px;
  font-weight: 600;
}

.meta-grid {
  width: 100%;
  margin: 0;
  border-collapse: collapse;
}

.meta-cell {
  padding: 0 24px 0 0;
  vertical-align: top;
}

.meta-label {
  margin: 0 0 4px;
  color: #8d84a0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.6px;
}

.meta-value {
  color: #d4cce4;
  font-size: 13px;
  font-weight: 600;
}

.content {
  margin: 0;
  padding: 0;
  color: #d4cce4;
}

${NOTE_PDF_CONTENT_STYLE}
`;