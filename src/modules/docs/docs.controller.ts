import Router from 'koa-router';
import { Context } from 'koa';
import path from 'path';
import fs from 'fs';

const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KoaNext API Documentation</title>
  <link rel="icon" type="image/png" href="/static/logo.png">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
    .swagger-ui .topbar { background: #0a0a0a; }
    .swagger-ui .topbar .download-url-wrapper input[type="text"] { border-color: #0ea5e9; }
    .swagger-ui .topbar .download-url-wrapper .download-url-button { background: #0ea5e9; }
    .swagger-ui .info .title { color: #171717; }
    .swagger-ui .scheme-container { background: #f8f9fa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      window.ui = SwaggerUIBundle({
        url: '/static/swagger.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout",
        validatorUrl: null
      });
    };
  </script>
</body>
</html>`;

const router = new Router({ prefix: '/docs' });

/**
 * Swagger UI 页面
 * GET /docs
 */
router.get('/', async (ctx: Context) => {
  // 检查 swagger.json 是否存在
  const swaggerJsonPath = path.join(process.cwd(), 'static', 'swagger.json');
  if (!fs.existsSync(swaggerJsonPath)) {
    ctx.status = 404;
    ctx.body = { error: 'Swagger configuration not found' };
    return;
  }

  ctx.type = 'text/html; charset=utf-8';
  ctx.body = swaggerHtml;
});

/**
 * Swagger JSON 配置
 * GET /docs/swagger.json
 */
router.get('/swagger.json', async (ctx: Context) => {
  const swaggerJsonPath = path.join(process.cwd(), 'static', 'swagger.json');
  if (!fs.existsSync(swaggerJsonPath)) {
    ctx.status = 404;
    ctx.body = { error: 'Swagger configuration not found' };
    return;
  }

  ctx.type = 'application/json';
  ctx.body = fs.createReadStream(swaggerJsonPath);
});

export { router as docsRouter };
