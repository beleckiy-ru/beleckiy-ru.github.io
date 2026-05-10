# tools/

Сборщик страниц услуг.

## Как добавить или изменить услугу

1. Откройте `services.json`. Это массив объектов — по одному на услугу.
2. Добавьте/измените поля:
   - `slug` — путь файла (без `.html`) и фрагмент URL.
   - `name` — название услуги (используется в `<h1>`, breadcrumbs, JSON-LD).
   - `image` — путь к картинке от корня сайта (например, `/img/img-slider-1-md.png`).
   - `alt` — alt-текст картинки и og:image:alt.
   - `title` — содержимое `<title>` (≤ 65 символов).
   - `metaDescription` — `<meta name="description">` (≤ 160 символов).
   - `ogTitle`, `ogDescription`, `twitterDescription` — для соцсетей.
   - `schemaDescription` — описание для JSON-LD (`MedicalProcedure.description`).
   - `bodyHtml` — основной контент. Допустим HTML (`<br>`, `<strong>` и т. п.).
3. Запустите сборку:
   ```
   node tools/build-services.mjs
   ```
4. После — добавьте URL в `sitemap.xml` (если это новая страница) и обновите карточки на главной (`index.html`, секция `.service__services`).

## Ограничения

В полях кроме `bodyHtml` нельзя использовать символы `"`, `\`, `<`, `>`, `&` —
они попадают как в HTML-атрибуты, так и в JSON-LD, и сломают разметку. Если
понадобится — допишите эскейп в `build-services.mjs`.

## CI

`tools/build-services.mjs` вызывается автоматически в обоих GitHub Actions
(`deploy.yml` и `deploy-prestable.yml`) перед минификацией. На S3 уезжают уже
сгенерированные файлы из `services/`.

В git коммитятся и шаблон, и сгенерированные `services/*.html` — чтобы
изменения были видны в diff'е PR-а.
