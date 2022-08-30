/* eslint-disable node/no-unpublished-require  */
/* eslint-disable node/no-unpublished-import  */
import { Application, Context } from '@midwayjs/koa';
import koaConnect from 'koa-connect';
import * as vite from 'vite';

import path from 'path';
import fs from 'fs';

const resolve = (p: string) => path.resolve(__dirname, p);

/**
 * 是否是生产
 */
export const isProd = process.env.NODE_ENV === 'production';

/**
 * vite 服务
 */
let viteServer: vite.ViteDevServer;
export async function createViteServer(app: Application) {
  viteServer = !viteServer
    ? await vite.createServer({
        root: 'web',
        logLevel: 'error',
        server: {
          middlewareMode: true,
        },
      })
    : viteServer;

  app.use(koaConnect(viteServer.middlewares));

  return viteServer;
}

/**
 * React render 准备就绪
 * @param ctx Context
 * @param template string html模板字符串
 * @param didError boolean 是否错误
 * @param stream PipeableStream React.PipeableStream
 * @param meta seo meta
 * @param state 状态store值
 */
function renderOnReady(
  ctx: Context,
  template: string,
  didError: boolean,
  stream,
  meta,
  state
) {
  const html = template
    .replace('"<!--app--state-->"', state)
    .replace('<!--app-title-->', meta.title)
    .replace('!--app-keywords--', meta.keywords)
    .replace('!--app-description--', meta.description);
  /*.replace('<!--app-html-->', appHtml) */
  const htmlArr = html.split('<!--app-html-->');

  ctx.res.statusCode = didError ? 500 : 200;
  ctx.response.set('Content-type', 'text/html');
  ctx.type = 'html';
  ctx.res.write(htmlArr[0]);
  stream.pipe(ctx.res);
  ctx.res.write(htmlArr[1]);
}

/**
 * 开发模式 render
 * @param isStream 是否流式传输
 * @param ctx Context
 * @param viteServer vite 服务
 */
export async function renderDev(
  isStream: boolean,
  ctx: Context,
  viteServer: vite.ViteDevServer
) {
  try {
    let template = fs.readFileSync(resolve('../web/index.html'), 'utf-8');
    template = await viteServer.transformIndexHtml(ctx.originalUrl, template);
    const { render } = await viteServer.ssrLoadModule('/entry-server.tsx');
    let didError = false;
    const [stream, meta, state] = await render(ctx.originalUrl, {
      ...(isStream === true
        ? {
            onShellReady() {
              /**
               * 所有Suspense边界之上的内容都准备好了。
               */
              renderOnReady(ctx, template, didError, stream, meta, state);
              // ctx.res.end();
            },
          }
        : {
            onAllReady() {
              /**
               * 如果您不想要流式传输，请使用它而不是 onShellReady。
               * 这将在整个页面内容准备好后触发。
               * 您可以将其用于爬虫或静态生成。
               */
              renderOnReady(ctx, template, didError, stream, meta, state);
              ctx.res.end();
            },
          }),
      onShellError(err: any) {
        /**
         * 在我们完成 shell 之前发生了一些错误，所以我们发出了一个替代 shell。
         */
        ctx.res.statusCode = 500;
        ctx.res.write('<!doctype html><body>Loading...</body></html>');
        ctx.res.end();
        console.error(err);
      },
      onError(err: any) {
        didError = true;
        console.error(err);
      },
    });
  } catch (e) {
    viteServer && viteServer.ssrFixStacktrace(e);
    console.log(e.stack);
    ctx.throw(500, e.stack);
  }
}

const template = isProd
  ? fs.readFileSync(resolve('../build/client/index.html'), 'utf-8')
  : '';
const prodRender = isProd
  ? require('../build/server/entry-server.js').render
  : function () {};
// const manifest = isProd ? require('../build/client/ssr-manifest.json') : {};

/**
 * 生成模式 render
 * @param isStream 是否流式传输
 * @param ctx Context
 */
export async function renderProd(isStream: boolean, ctx: Context) {
  try {
    let didError = false;
    const [stream, meta, state] = await prodRender(ctx.originalUrl, {
      ...(isStream === true
        ? {
            onShellReady() {
              /**
               * 所有Suspense边界之上的内容都准备好了。
               */
              renderOnReady(ctx, template, didError, stream, meta, state);
              // ctx.res.end();
            },
          }
        : {
            onAllReady() {
              /**
               * 如果您不想要流式传输，请使用它而不是 onShellReady。
               * 这将在整个页面内容准备好后触发。
               * 您可以将其用于爬虫或静态生成。
               */
              renderOnReady(ctx, template, didError, stream, meta, state);
              ctx.res.end();
            },
          }),
      onShellError(err: any) {
        /**
         * 在我们完成 shell 之前发生了一些错误，所以我们发出了一个替代 shell。
         */
        ctx.res.statusCode = 500;
        ctx.res.write('<!doctype html><body>Loading...</body></html>');
        ctx.res.end();
        console.error(err);
      },
      onError(err: any) {
        didError = true;
        console.error(err);
      },
    });
  } catch (e) {
    ctx.throw(500, e.stack);
  }
}

/**
 * render入口
 * @param ctx Context
 * @param app Application
 * @param isStream 是否流式传输 默认 false
 * @returns
 */
export async function render(ctx: Context, app: Application, isStream = false) {
  ctx.respond = false;
  if (isProd) {
    return renderProd(isStream, ctx);
  } else {
    const vServer = await createViteServer(app);
    return renderDev(isStream, ctx, vServer);
  }
}
