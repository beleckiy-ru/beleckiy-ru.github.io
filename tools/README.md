# tools/

Сборщики страниц услуг и карты сайта.

## Как добавить или изменить услугу

1. Откройте `services.json`. Это массив объектов — по одному на услугу.
2. Добавьте/измените поля:
   - `slug` — путь файла (без `.html`) и фрагмент URL.
   - `name` — название услуги (используется в `<h1>`, breadcrumbs, JSON-LD).
   - `intro` — развёрнутый текст под названием услуги (раздел hero).
   - `image` — путь к картинке от корня сайта (`/img/img-slider-1-md.webp`).
   - `ogImage` — картинка для соцсетей/JSON-LD (`/img/img-slider-1-og.jpg`).
   - `alt` — alt-текст картинки и og:image:alt.
   - `title` — содержимое `<title>` (≤ 65 символов).
   - `metaDescription` — `<meta name="description">` (≤ 160 символов).
   - `ogTitle`, `ogDescription`, `twitterDescription` — для соцсетей.
   - `schemaDescription` — описание для JSON-LD (`MedicalProcedure.description`).
   - `article` — массив секций статьи `{ "h2": "...", "html": "..." }`.
     В `html` допустим HTML (`<p>`, `<ul>`, `<ol>`, `<strong>` и т. п.).
3. Запустите сборку:
   ```
   node tools/build-services.mjs
   node tools/build-sitemap.mjs
   ```
4. Если это **новая** страница — обновите карточки на главной
   (`index.html`, секция `.service__services`). Sitemap обновится сам.

## build-sitemap.mjs

Генерирует `sitemap.xml` из списка в `services.json` + главная.
`lastmod` каждой страницы берётся из даты последнего коммита её файла
(`git log -1 --format=%cs`). Если файл не закоммичен — ставится сегодняшняя дата.

## Ограничения

В полях кроме `article[].html` нельзя использовать символы `"`, `\`, `<`, `>`, `&` —
они попадают как в HTML-атрибуты, так и в JSON-LD, и сломают разметку. Если
понадобится — допишите эскейп в `build-services.mjs`.

## CI

В обоих GitHub Actions (`deploy.yml` и `deploy-prestable.yml`) перед минификацией
выполняются `build-services.mjs` и `build-sitemap.mjs`. На S3 уезжают уже
сгенерированные файлы. Для корректных дат в sitemap в `actions/checkout` задан
`fetch-depth: 0` (полная история).

В git коммитятся и шаблон, и сгенерированные `services/*.html`, и `sitemap.xml` —
чтобы изменения были видны в diff'е PR-а.
