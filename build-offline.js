// Собирает самодостаточные HTML-файлы, которые работают без интернета:
//   «Бит и Случай.html»           — обе книги вместе
//   sites/sluchai-teorver/index.html — только «Случай» (отдельный репозиторий и сайт)
//   sites/bit-vms/index.html         — только «Бит» (отдельный репозиторий и сайт)
// Запуск: node build-offline.js
const fs = require('fs'), path = require('path');
const dir = __dirname, read = f => fs.readFileSync(path.join(dir, f), 'utf8');
const SRC = {tv: 'tv.js', vms: 'vms.js'};

function build(keys, out, title, description){
  let page = read('book/index.html');
  page = page.replace(/<link rel="preconnect"[^>]*>\s*/g, '')
             .replace(/<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com[^>]*>/, () => `<style>\n${read('fonts/fonts.css')}</style>`)
             .replace(/<title>[^<]*<\/title>/, () => `<title>${title}</title>\n<meta name="description" content="${description}">`);
  for (const [k, js] of Object.entries(SRC)){
    const tag = `<script src="${js}"></script>`;
    if (!page.includes(tag)) throw new Error('не найден ' + tag);
    const code = keys.includes(k) ? read('book/' + js) : '';
    if (code.includes('</script')) throw new Error(js + ' содержит </script>');
    page = page.replace(tag, () => code ? `<script>\n${code}\n</script>` : '');
  }
  const cut = page.indexOf('<header class="top">');
  const html = `<!doctype html>\n<html lang="ru">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n<style>body{margin:0}</style>\n${page.slice(0, cut)}</head>\n<body>\n${page.slice(cut)}\n</body>\n</html>\n`;
  fs.mkdirSync(path.dirname(path.join(dir, out)), {recursive: true});
  fs.writeFileSync(path.join(dir, out), html);
  console.log(`${out}: ${Math.round(Buffer.byteLength(html) / 1024)} КБ`);
}

build(['tv','vms'], 'Бит и Случай.html', 'Бит и Случай', 'Интерактивная книга к сессии: теория вероятностей и вычислительные машины и системы.');
build(['tv'], 'sites/sluchai-teorver/index.html', 'Случай — теория вероятностей', 'Интерактивный учебник по теории вероятностей и математической статистике по Гмурману: 11 глав, опыты, задачи с проверкой.');
build(['vms'], 'sites/bit-vms/index.html', 'Бит — вычислительные машины и системы', 'Интерактивный учебник по ВМиС: системы счисления, коды, DOS, ассемблер 8086, видеорежимы. 10 глав, эмуляторы, задачи с проверкой.');
