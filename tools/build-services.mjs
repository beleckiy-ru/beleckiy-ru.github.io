#!/usr/bin/env node
// Генератор страниц услуг.
// Источник: tools/services.json + tools/service.template.html
// Результат: services/<slug>.html для каждой записи в JSON.
//
// Поля в JSON, кроме bodyHtml, должны содержать только обычный текст —
// никаких символов ", \, <, >, & (внутри JSON-LD они сломают разметку).
// Поле bodyHtml допускает HTML (<br>, <strong> и т. п.).

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const dataPath = join(__dirname, 'services.json');
const templatePath = join(__dirname, 'service.template.html');
const outDir = join(ROOT, 'services');

const [services, template] = await Promise.all([
    readFile(dataPath, 'utf8').then(JSON.parse),
    readFile(templatePath, 'utf8'),
]);

await mkdir(outDir, { recursive: true });

let count = 0;
for (const svc of services) {
    let html = template;
    for (const [key, value] of Object.entries(svc)) {
        html = html.replaceAll(`{{${key}}}`, value);
    }
    // Проверка: остались ли необработанные плейсхолдеры
    const leftovers = html.match(/\{\{[\w]+\}\}/g);
    if (leftovers) {
        throw new Error(
            `В странице ${svc.slug}.html остались плейсхолдеры: ${[...new Set(leftovers)].join(', ')}`
        );
    }
    const outPath = join(outDir, `${svc.slug}.html`);
    await writeFile(outPath, html, 'utf8');
    count++;
    console.log(`✓ ${svc.slug}.html`);
}

console.log(`\nСобрано страниц: ${count}`);
