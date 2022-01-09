import { Database} from 'https://deno.land/x/denodb/mod.ts';
import{Rodzaj,Status,Projekt }from './model.ts'
import{connector}from './connector.ts'
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
const db = new Database(connector);
db.link([Rodzaj]);
db.link([Status]);
db.link([Projekt]);
await db.sync({ drop: false });

app.use(viewEngine(oakAdapter, ejsEngine,{viewRoot: "./views"}));
router.get("/sse", (ctx) => {
  const target = ctx.sendEvents();
  target.dispatchMessage({ hello: "world" });
});
router.get("/", (ctx) => {
  ctx.render("./index.ejs", { data: { name: "abc" ,tytul:"index"} });
});
router.get("/projekty", async (ctx) => {
  ctx.render("./projekty.ejs", { data: { name: "projekty" ,tytul:"projekty"},projekt:await Projekt.all(),rodzaj: await Rodzaj.all(),status: await Status.all() });
});
router.get("/rodzaje", async (ctx) => {

  ctx.render("./rodzaje.ejs", { data: { name: "rodzaje" ,tytul:"rodzaje"},rodzaj: await Rodzaj.all()});
});
router.get("/status", async (ctx) => {

  ctx.render("./status.ejs", { data: { name: "status" ,tytul:"status"},status: await Status.all()});
});


router.post('/rodzajepost', async context => {
  const body = await context.request.body({ type: 'form-data'})
  const data = await body.value.read()
  
  console.log(data)
  if (typeof  data.fields['id_rodzaj'] ==='undefined' &&typeof data.fields['nazwa_rodzaj'] == 'string') {
    await Rodzaj.create({nazwa_rodzaj:data.fields['nazwa_rodzaj']},)
  console.log("dodajemy"+data.fields['nazwa_rodzaj'])
  }else if (typeof data.fields['zapisz'] != 'undefined' ) {
   console.log('zmioana'+data.fields['id_rodzaj']+" "+data.fields['nazwa_rodzaj'])
     await Rodzaj.where({id_rodzaj: data.fields['id_rodzaj'] }).update({ nazwa_rodzaj:  data.fields['nazwa_rodzaj'] });

  }else if (typeof data.fields['usun'] != 'undefined') {
    
await Rodzaj.deleteById(data.fields['id_rodzaj']);
  }
  context.response.redirect('/rodzaje')
})

router.post('/statuspost', async context => {
  const body = await context.request.body({ type: 'form-data'})
  const data = await body.value.read()
  
  console.log(data)
  if (typeof  data.fields['id_status'] ==='undefined' &&typeof data.fields['nazwa_status'] == 'string') {
    await Status.create({nazwa_status:data.fields['nazwa_status']},)
  console.log("dodajemy"+data.fields['nazwa_status'])
  }else if (typeof data.fields['zapisz'] != 'undefined' ) {
   console.log('zmioana'+data.fields['id_status']+" "+data.fields['nazwa_status'])
     await Status.where({id_status: data.fields['id_status'] }).update({ nazwa_status:  data.fields['nazwa_status'] });

  }else if (typeof data.fields['usun'] != 'undefined') {
    
await Status.deleteById(data.fields['id_status']);
  }
  context.response.redirect('/status')
})

router.post('/projektpost', async context => {
  const body = await context.request.body({ type: 'form-data'})
  const data = await body.value.read()
  
  console.log(data)
  if (typeof  data.fields['id_projekt'] ==='undefined' ) {
    await Projekt.create({nazwa_status:data.fields['nazwa_status']},)
    console.log(data)
    console.log("dodajemy"+data.fields['nr_projekt'])
  }else if (typeof data.fields['zapisz'] != 'undefined' ) {
   console.log('zmioana'+data.fields['id_status']+" "+data.fields['nazwa_status'])
     await Status.where({id_status: data.fields['id_status'] }).update({ nazwa_status:  data.fields['nazwa_status'] });

  }else if (typeof data.fields['usun'] != 'undefined') {
    
await Status.deleteById(data.fields['id_status']);
  }
  context.response.redirect('/status')
})

app.use(router.routes());
console.log("http://localhost")
await app.listen({ port: 80 });
