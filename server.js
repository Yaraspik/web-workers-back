import Koa from 'koa';
import koaBody from 'koa-body';
import Router from '@koa/router';
import cors from '@koa/cors';
// eslint-disable-next-line import/no-extraneous-dependencies
import slow from 'koa-slow';

// eslint-disable-next-line import/extensions
import NewsManager from './newsCreator.js';
// import randomInterval from './interval.js';

const port = 3000;
const app = new Koa();
const router = new Router();

app
  .use(cors())
  .use(koaBody({
    text: true,
    urlencoded: true,
    miltipart: true,
    json: true,
  }));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*' };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request);
    }

    ctx.response.status = 204;
  }

  return false;
});

app.use(
  slow({
    delay: 3000,
  }),
);

router
  .get('unreadable news', '/news', (ctx) => {
    const news = {
      status: 'ok',
      timestamp: Date.now(),
      news: [],
    };

    const arNews = NewsManager.createNewsPack();
    news.news = JSON.stringify(arNews);

    ctx.response.body = news;
  });

app.use(router.routes()).use(router.allowedMethods());

const bootstrap = async () => {
  try {
    app.listen(port, () => console.log(`Server has been started on http://localhost:${port}`));
  } catch (err) {
    console.error(err);
  }
};

bootstrap();
