import { App, Controller, Get, Inject } from '@midwayjs/decorator';

import { Application, Context } from '@midwayjs/koa';

import { render } from '../vite.server';

@Controller('/')
export class HomeController {
  @App()
  app: Application;

  @Inject()
  ctx: Context;

  @Get('/')
  @Get('/about')
  @Get('/detail')
  @Get('/localapi')
  @Get('/404')
  async home(): Promise<void> {
    render(this.ctx, this.app, true);
  }
}
