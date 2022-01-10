import { Database } from 'https://deno.land/x/denodb/mod.ts';
import { Rodzaj, Status, Projekt } from './model.ts'
import { connector } from './connector.ts'
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

app.use(viewEngine(oakAdapter, ejsEngine, { viewRoot: "./views" }));
router.get("/sse", (ctx) => {
  const target = ctx.sendEvents();
  target.dispatchMessage({ hello: "world" });
});
router.get("/", (ctx) => {
  ctx.render("./index.ejs", { data: { name: "abc", tytul: "index" } });
});
router.get("/projekty", async (ctx) => {
  console.log(await Projekt.all())
  ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: await Projekt.all(), rodzaj: await Rodzaj.all(), status: await Status.all() });
});
router.get("/rodzaje", async (ctx) => {

  ctx.render("./rodzaje.ejs", { data: { name: "rodzaje", tytul: "rodzaje" }, rodzaj: await Rodzaj.all() });
});
router.get("/status", async (ctx) => {

  ctx.render("./status.ejs", { data: { name: "status", tytul: "status" }, status: await Status.all() });
});


router.post('/rodzajepost', async ctx => {
  const body = await ctx.request.body({ type: 'form-data' })
  const data = await body.value.read()

  let tekst = 'błąd';
  console.log(data)

  if (typeof data.fields['id_rodzaj'] === 'undefined' && typeof data.fields['nazwa_rodzaj'] == 'string') {
    tekst = ""
    try {
      await Rodzaj.create({ nazwa_rodzaj: data.fields['nazwa_rodzaj'] },)
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }

    tekst = tekst + "dodano " + data.fields['nazwa_rodzaj']
    console.log("dodajemy" + data.fields['nazwa_rodzaj'])
  } else if (typeof data.fields['zapisz'] != 'undefined') {
    tekst = ""
    console.log('zmioana' + data.fields['id_rodzaj'] + " " + data.fields['nazwa_rodzaj'])
    try {
      await Rodzaj.where({ id_rodzaj: data.fields['id_rodzaj'] }).update({ nazwa_rodzaj: data.fields['nazwa_rodzaj'] })

    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }

    tekst = tekst + " zmieniono na " + data.fields['nazwa_rodzaj']

  } else if (typeof data.fields['usun'] != 'undefined') {
    tekst = ""
    try {
      await Rodzaj.deleteById(data.fields['id_rodzaj'])
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }


    tekst = tekst + " usuniento " + data.fields['nazwa_rodzaj']
  }

  ctx.render("./info.ejs", { data: { name: "rodzaje", tytul: "rodzaje", abc: tekst, link: "rodzaje" } });
  // context.response.redirect('/rodzaje')
})

router.post('/statuspost', async ctx => {
  const body = await ctx.request.body({ type: 'form-data' })
  const data = await body.value.read()
  let tekst = '';
  console.log(data)
  if (typeof data.fields['id_status'] === 'undefined' && typeof data.fields['nazwa_status'] == 'string') {
    try {
      await Status.create({ nazwa_status: data.fields['nazwa_status'] },)
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }
    tekst = tekst + " dodano " + data.fields['nazwa_status']
    console.log("dodajemy" + data.fields['nazwa_status'])
  } else if (typeof data.fields['zapisz'] != 'undefined') {
    console.log('zmioana' + data.fields['id_status'] + " " + data.fields['nazwa_status'])
    try {
      await Status.where({ id_status: data.fields['id_status'] }).update({ nazwa_status: data.fields['nazwa_status'] })
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }
    tekst = tekst + " zmieniono " + data.fields['nazwa_status']
  } else if (typeof data.fields['usun'] != 'undefined') {
    try {
      await Status.deleteById(data.fields['id_status'])
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }
    tekst = tekst + " usuniento " + data.fields['nazwa_status']
  }

  ctx.render("./info.ejs", { data: { name: "status", tytul: "status", abc: tekst, link: "status" } });
  // context.response.redirect('/status')
})

router.post('/projektpost', async ctx => {
  const body = await ctx.request.body({ type: 'form-data' })
  const data = await body.value.read()

  console.log(data)
  let tekst = 'błąd'
  if (typeof data.fields['id_projekt'] === 'undefined') {
    tekst = ''
    let data_zakonczenia
    if (data.fields['data_zakonczenia'] == '') {
      data_zakonczenia = null
    } else {
      data_zakonczenia = data.fields['data_zakonczenia']
    }
    let uwagi
    if (data.fields['uwagi'] == '') {
      uwagi = null
    } else {

      uwagi = data.fields['uwagi']
    }
    try {
      await Projekt.create({
        nr_projekt: data.fields['nr_projekt'],
        temat_projekt: data.fields['temat_projekt'],
        data_rozpoczecia: data.fields['data_rozpoczecia'],
        data_zakonczenia: data_zakonczenia,
        kwota: data.fields['kwota'],
        uwagi: uwagi,
        status_id_status: data.fields['status'],
        rodzaj_id_rodzaj: data.fields['rodzaj']
      })
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }
    tekst = tekst + " dodano " + data.fields['nr_projekt']
      + " " + data.fields['temat_projekt']
      + " " + data.fields['data_rozpoczecia']
      + " " + data.fields['data_zakonczenia']
      + " " + data.fields['kwota']
      + " " + data.fields['uwagi']
    console.log(tekst)


  } else if (typeof data.fields['zapisz'] != 'undefined') {
    tekst = ''
    let data_zakonczenia
    if (data.fields['data_zakonczenia'] == '') {
      data_zakonczenia = null
    } else {
      data_zakonczenia = data.fields['data_zakonczenia']
    }
    let uwagi
    if (data.fields['uwagi'] == '') {
      uwagi = null
    } else {

      uwagi = data.fields['uwagi']
    }
    try {
      await Projekt.where({ idprojekt: data.fields['id_projekt'] }).update({
        nr_projekt: data.fields['nr_projekt'],
        temat_projekt: data.fields['temat_projekt'],
        data_rozpoczecia: data.fields['data_rozpoczecia'],
        data_zakonczenia: data_zakonczenia,
        kwota: data.fields['kwota'],
        uwagi: uwagi,
        status_id_status: data.fields['status'],
        rodzaj_id_rodzaj: data.fields['rodzaj']
      })
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }
    tekst = tekst + " zmieniono na  " + data.fields['nr_projekt']
      + " " + data.fields['temat_projekt']
      + " " + data.fields['data_rozpoczecia']
      + " " + data.fields['data_zakonczenia']
      + " " + data.fields['kwota']
      + " " + data.fields['uwagi']
    console.log(tekst)


  } else if (typeof data.fields['usun'] != 'undefined') {

    tekst = ''

    try {

      await Projekt.deleteById(data.fields['id_projekt']);
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }
    tekst = tekst + " usunieto na  " + data.fields['nr_projekt']
      + " " + data.fields['temat_projekt']
      + " " + data.fields['data_rozpoczecia']
      + " " + data.fields['data_zakonczenia']
      + " " + data.fields['kwota']
      + " " + data.fields['uwagi']
    console.log(tekst)
  }
  ctx.render("./info.ejs", { data: { name: "projekt", tytul: "projekt", abc: tekst, link: "projekty" } });
  // context.response.redirect('/status')
})
app.use(router.routes());
console.log("http://localhost")
await app.listen({ port: 80 });
