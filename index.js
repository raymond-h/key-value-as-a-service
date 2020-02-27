const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const db = require('./level');

const app = new Koa();
const router = new Router();

const keyForId = id => `value|${id}`;

const allowedIds = (process.env['ALLOWED_IDS'] || '').split(/\|/g);

router
.get('/key/:id', async ctx => {
    ctx.assert(allowedIds.includes(ctx.params.id), 403);

    try {
        const value = await db.get(keyForId(ctx.params.id));
        ctx.body = value;
    }
    catch(e) {
        if(e.notFound) {
            ctx.throw(404, 'No such id stored');
        }
        else {
            throw e;
        }
    }
})
.post('/key/:id', async ctx => {
    ctx.assert(allowedIds.includes(ctx.params.id), 403);

    await db.put(keyForId(ctx.params.id), ctx.request.body);

    ctx.body = {key: keyForId(ctx.params.id), value: ctx.request.body, success: true};
});

app
.use(bodyParser())
.use(router.routes())
.use(router.allowedMethods());

app.listen(process.env['PORT'] || 3000);
