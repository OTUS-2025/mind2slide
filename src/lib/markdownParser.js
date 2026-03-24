/**
 * Простой парсер markdown для базовых элементов
 * @param {string} markdown - исходный markdown текст
 * @returns {string} - HTML строка
 */
export function parseMarkdown(markdown) {
  if (!markdown) return '';
  
  let html = markdown;
  
  // Преобразуем заголовки (h1-h6)
  html = html.replace(/^###### (.*$)/gim, '<h6>$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5>$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Преобразуем жирный и курсивный текст
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  
  // Преобразуем ссылки
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  
  // Преобразуем изображения
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img alt="$1" src="$2" />');
  
  // Преобразуем списки
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Оборачиваем списки в теги
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  // Преобразуем абзацы
  html = html.split('\n\n').map(paragraph => {
    if (!paragraph.trim()) return '';
    if (paragraph.startsWith('<') && paragraph.endsWith('>')) return paragraph.trim();
    return `<p>${paragraph.trim()}</p>`;
  }).join('');
  
  // Удаляем лишние пустые строки
  html = html.replace(/\n/g, '');
  
  return html;
}

/**
 * Загружает и парсит markdown файл
 * @param {string} filePath - путь к markdown файлу
 * @returns {Promise<string>} - Promise, который резолвится в HTML строку
 */
export async function loadMarkdownFile(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${response.statusText}`);
    }
    const markdown = await response.text();
    return parseMarkdown(markdown);
  } catch (error) {
    console.error('Error loading markdown file:', error);
    return '<p>Ошибка при загрузке файла</p>';
  }
}