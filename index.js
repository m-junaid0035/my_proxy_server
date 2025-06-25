const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/', (req, res, next) => {
  const fullUrl = req.url.slice(1); // Remove the leading "/"

  // Validate the input URL
  if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
    return res.status(400).send('⚠️ Please request like: /https://example.com/path');
  }

  try {
    const parsedUrl = new URL(fullUrl);

    const target = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const newPath = parsedUrl.pathname + parsedUrl.search;

    console.log(`[🔁] Proxying to: ${target}${newPath}`);

    return createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: () => newPath,
      logLevel: 'debug',
    })(req, res, next);

  } catch (error) {
    return res.status(400).send('❌ Invalid URL provided');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Proxy running on http://localhost:${PORT}`);
});
