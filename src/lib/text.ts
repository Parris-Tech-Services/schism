export function stripHtml(value: string): string {
  if (typeof document === 'undefined') return value.replace(/<[^>]*>/g, ' ');
  const el = document.createElement('div');
  el.innerHTML = value;
  return el.textContent ?? '';
}

export function excerpt(value: string, length = 170): string {
  const clean = stripHtml(value).replace(/\s+/g, ' ').trim();
  return clean.length <= length ? clean : `${clean.slice(0, length).trim()}…`;
}

export function downloadText(filename: string, content: string, type = 'application/json'): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
