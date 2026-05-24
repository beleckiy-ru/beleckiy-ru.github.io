#!/usr/bin/env node
// Генератор sitemap.xml.
// lastmod для каждой страницы берётся из даты последнего коммита её файла
// (git log -1 --format=%cs). Если файл ещё не закоммичен или git недоступен —
// fallback на сегодняшнюю дату.
//
// ВАЖНО: для корректных дат в CI нужен полный git-clone — в checkout укажите
// fetch-depth: 0, иначе git увидит только последний коммит и все даты совпадут.

import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const BASE = 'https://beleckiy.ru';

const today = new Date().toISOString().slice(0, 10);

function gitDate(relPath) {
    try {
        const out = execSync(`git log -1 --format=%cs -- "${relPath}"`, {
            cwd: ROOT, encoding: 'utf8',
        }).trim();
        return out || today;
    } catch {
        return today;
    }
}

const services = JSON.parse(await readFile(join(__dirname, 'services.json'), 'utf8'));

const pages = [
    { loc: `${BASE}/`, file: 'index.html', priority: '1.0', changefreq: 'monthly' },
    ...services.map(s => ({
        loc: `${BASE}/services/${s.slug}.html`,
        file: `services/${s.slug}.html`,
        priority: '0.8',
        changefreq: 'monthly',
    })),
];

const urls = pages.map(p => `    <url>
        <loc>${p.loc}</loc>
        <lastmod>${gitDate(p.file)}</lastmod>
        <changefreq>${p.changefreq}</changefreq>
        <priority>${p.priority}</priority>
    </url>`).join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

await writeFile(join(ROOT, 'sitemap.xml'), xml, 'utf8');
console.log(`✓ sitemap.xml: ${pages.length} URL`);
for (const p of pages) console.log(`  ${p.file.padEnd(40)} ${gitDate(p.file)}`);
