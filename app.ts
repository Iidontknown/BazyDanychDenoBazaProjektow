// import { Database} from 'https://deno.land/x/denodb/mod.ts';
// import{Rodzaj,Status,Projekt }from './model.ts'
// import{connector}from './connector.ts'
import {
  viewEngine,
  engineFactory,
  adapterFactory,
} from "https://deno.land/x/view_engine@v1.5.0/mod.ts";
import { Application, Router } from "https://deno.land/x/oak@v6.5.0/mod.ts";
const ejsEngine = engineFactory.getEjsEngine();
const oakAdapter = adapterFactory.getOakAdapter();

const app = new Application();
const router = new Router();

app.use(viewEngine(oakAdapter, ejsEngine));
router.get("/sse", (ctx) => {
  const target = ctx.sendEvents();
  target.dispatchMessage({ hello: "world" });
});
router.get("/", (ctx) => {
  ctx.render("./views/index.ejs", { data: { name: "John" } });
});

app.use(router.routes());
await app.listen({ port: 80 });
console.log("http://localhost")
