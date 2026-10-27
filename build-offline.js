// Собирает «Бит и Случай.html» — один файл, который работает без интернета.
// Запуск: node build-offline.js
const fs = require('fs'), path = require('path');
const dir = __dirname, read = f => fs.readFileSync(path.join(dir, f), 'utf8');

let page = read('book/index.html');
const fonts = read('fonts/fonts.css');

// Google Fonts заменяем встроенными шрифтами, внешние скрипты — их текстом
page = page.replace(/<link rel="preconnect"[^>]*>\s*/g, '')
           .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, () => `<style>\n${fonts}</style>`);
for (const js of ['tv.js', 'vms.js']){
  const code = read('book/' + js);
  if (code.includes('</script')) throw new Error(js + ' содержит </script>');
  const tag = `<script src="${js}"></script>`;
  if (!page.includes(tag)) throw new Error('не найден ' + tag);
  page = page.replace(tag, () => `<script>\n${code}\n</script>`);
}
if (/https?:\/\/(?!claude\.ai|iamtechartist)/.test(page.replace(/<a [^>]*>/g, ''))) console.warn('Внимание: в файле остались внешние ссылки');

const cut = page.indexOf('<header class="top">');
const html = `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<style>body{margin:0}</style>
${page.slice(0, cut)}</head>
<body>
${page.slice(cut)}
</body>
</html>
`;
fs.writeFileSync(path.join(dir, 'Бит и Случай.html'), html);
console.log('Готово: Бит и Случай.html, ' + Math.round(Buffer.byteLength(html) / 1024) + ' КБ');
