export const NOTE_PDF_CONTENT_STYLE = `
.content > :first-child {
  margin-top: 0;
}

h1, h2, h3, h4 {
  color: #f0ecf8;
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 700;
  line-height: 1.22;
}

h1 {
  margin: 22px 0 8px;
  font-size: 24px;
}

h2 {
  margin: 20px 0 8px;
  font-size: 20px;
}

h3 {
  margin: 18px 0 6px;
  font-size: 17px;
}

p {
  margin: 0 0 10px;
}

ul,
ol {
  margin: 0 0 10px 18px;
  padding: 0;
}

li {
  margin: 0 0 4px;
}

a {
  color: #c4b5fd;
}

blockquote {
  margin: 12px 0;
  padding: 8px 12px;
  border-left: 3px solid #a78bfa;
  background: #1a1426;
  color: #b9b0ca;
}

code {
  color: #c4b5fd;
  font-family: "Courier New", monospace;
  font-size: 12px;
}

pre {
  margin: 12px 0;
  padding: 12px;
  border: 1px solid #2b2340;
  background: #161020;
  white-space: pre-wrap;
}

pre code {
  color: #e7e1f3;
}

img {
  display: block;
  max-width: 100%;
  margin: 14px 0;
}

table {
  width: 100%;
  margin: 12px 0;
  border-collapse: collapse;
}

th,
td {
  padding: 7px 8px;
  border-bottom: 1px solid #2b2340;
  text-align: left;
}

th {
  color: #c4b5fd;
  font-size: 11px;
  font-weight: 700;
}

hr {
  margin: 18px 0;
  border: 0;
  border-top: 1px solid #2b2340;
}
`;