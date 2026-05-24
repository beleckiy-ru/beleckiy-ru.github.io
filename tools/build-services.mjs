#!/usr/bin/env node
// Генератор страниц услуг.
// Источник: tools/services.json + tools/service.template.html
// Результат: services/<slug>.html для каждой записи в JSON.
//
// Поля в JSON, кроме bodyHtml, должны содержать только обычный текст —
// никаких символов ", \, <, >, & (внутри JSON-LD они сломают разметку).
// Поле bodyHtml допускает HTML (<br>, <strong> и т. п.).
// Поле relatedHtml собирается автоматически — список ссылок на остальные услуги.

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

/** Собрать HTML-блок «Другие услуги» для конкретной услуги (без неё самой). */
function buildRelated(currentSlug, all) {
    return all
        .filter(s => s.slug !== currentSlug)
        .map(s => (
            `<a href="/services/${s.slug}.html" class="svc-related__card">` +
              `<span>${s.name}</span>` +
              `<span class="svc-related__arrow" aria-hidden="true">→</span>` +
            `</a>`
        ))
        .join('\n                ');
}

/** Собрать статью услуги из массива секций {h2, html}. */
function buildArticle(sections) {
    return sections
        .map(s => `<h2 class="svc-article__title">${s.h2}</h2>\n                ${s.html}`)
        .join('\n                ');
}

let count = 0;
for (const svc of services) {
    const ctx = {
        ...svc,
        relatedHtml: buildRelated(svc.slug, services),
        articleHtml: buildArticle(svc.article || []),
    };
    let html = template;
    for (const [key, value] of Object.entries(ctx)) {
        html = html.replaceAll(`{{${key}}}`, value);
    }
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
