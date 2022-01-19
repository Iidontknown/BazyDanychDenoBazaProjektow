import { Database } from 'https://deno.land/x/denodb/mod.ts';
import { Rodzaj, Status, Projekt,Stawszproj,Statstykiprojektrodzaj,Statstykiprojektstatus} from './model.ts'
import {Osoba,Magazyn_sor} from './modelEzor.ts'
import { connector,connectorEzor } from './connector.ts'
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
const dbEzor = new Database(connectorEzor);
db.link([Rodzaj]);
db.link([Status]);
db.link([Projekt]);
db.link([Stawszproj]);
db.link([Statstykiprojektrodzaj]);
db.link([Statstykiprojektstatus]);
dbEzor.link([Osoba]);
dbEzor.link([Magazyn_sor]);
await db.sync({ drop: false });
await dbEzor.sync({ drop: false });

app.use(viewEngine(oakAdapter, ejsEngine, { viewRoot: "./views" }));
router.get("/help", (ctx) => {
  const target = ctx.sendEvents();
  target.dispatchMessage({ hello: "Brak danych" });
});
router.get("/", (ctx) => {
  ctx.render("./index.ejs", { data: { name: "abc", tytul: "index" } });
});
router.get("/projekty", async (ctx) => {
 
  ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: await Projekt.all(), rodzaj: await Rodzaj.all(), status: await Status.all() ,rodzajWyb:null,idWyb:null,idWyb1:null});
});
router.get("/projekty:r/:id", async (ctx) => {
  console.log("params:"+ctx?.params?.id) 
  console.log("params:"+ctx?.params?.r) 
 let tempProjekt
 if (ctx?.params?.r =='S' && typeof ctx?.params?.id != 'undefined' ) {
     tempProjekt =await Projekt.where('status_id_status',ctx?.params?.id).get()
ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: tempProjekt, rodzaj: await Rodzaj.all(), status: await Status.all() ,rodzajWyb:ctx?.params?.r,idWyb:ctx?.params?.id,idWyb1:null});

 }else if(ctx?.params?.r =='R' && typeof ctx?.params?.id != 'undefined'){
  tempProjekt =await Projekt.where('rodzaj_id_rodzaj',ctx?.params?.id).get()
ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: tempProjekt, rodzaj: await Rodzaj.all(), status: await Status.all() ,rodzajWyb:ctx?.params?.r,idWyb:ctx?.params?.id,idWyb1:null});
}else if(ctx?.params?.r =='T' && typeof ctx?.params?.id != 'undefined'){

  tempProjekt =await Projekt.where('temat_projekt',ctx?.params?.id).get()
ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: tempProjekt, rodzaj: await Rodzaj.all(), status: await Status.all() ,rodzajWyb:ctx?.params?.r,idWyb:ctx?.params?.id,idWyb1:null});
}else{
  ctx.response.redirect('/projekty')
 }
 
});
router.get("/projekty:r/:val1/:val2", async (ctx) => {
  console.log("val1:"+ctx?.params?.val1) 
  console.log("val2:"+ctx?.params?.val2) 
  console.log("r:"+ctx?.params?.r) 
 let tempProjekt
 
 if (ctx?.params?.r =='D' && typeof ctx?.params?.val1 != 'undefined'&& typeof ctx?.params?.val2 != 'undefined' && ctx.params.val2!=null ) {
  tempProjekt =await Projekt.where('data_rozpoczecia','>=',ctx?.params?.val2).where('data_rozpoczecia','<=',ctx?.params?.val1).get()
  
ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: tempProjekt, rodzaj: await Rodzaj.all(), status: await Status.all() ,rodzajWyb:ctx?.params?.r,idWyb:ctx?.params?.val1,idWyb1:ctx?.params?.val2});

 }else if (ctx?.params?.r =='K' && typeof ctx?.params?.val1 != 'undefined'&& typeof ctx?.params?.val2 != 'undefined' ) {
  tempProjekt =await Projekt.where('kwota','<',ctx?.params?.val2).where('kwota','>',ctx?.params?.val1).get()
ctx.render("./projekty.ejs", { data: { name: "projekty", tytul: "projekty" }, projekt: tempProjekt, rodzaj: await Rodzaj.all(), status: await Status.all() ,rodzajWyb:ctx?.params?.r,idWyb:ctx?.params?.val1,idWyb1:ctx?.params?.val2});

}else{
  ctx.response.redirect('/projekty')
 }
 
});
router.get("/rodzaje", async (ctx) => {

  ctx.render("./rodzaje.ejs", { data: { name: "rodzaje", tytul: "rodzaje" }, rodzaj: await Rodzaj.all() });
});
router.get("/status", async (ctx) => {

  ctx.render("./status.ejs", { data: { name: "status", tytul: "status" }, status: await Status.all() });
});
router.get("/staWszProj", async (ctx) => {
  const stawszproj=await Stawszproj.all()
  
  const tekst = " liczba projektów:"+stawszproj[0].count+" " +" 	kwota minimalna:"+stawszproj[0].min+" 	kwota max:"+stawszproj[0].max+" 	kwota suma:"+stawszproj[0].sum+" "
  
  ctx.render("./info.ejs", { data: { name: "statystyki projekty", tytul: "statystyki projekty", abc: tekst, link: "" } });
});
router.get("/statstykiprojektrodzaj", async (ctx) => {
  
  
  ctx.render("./statstykiprojektrodzaj.ejs", { data: { name: "statystyki projekty wg rodzaju", tytul: "statystyki projekty wg rodzaju"}, dane: await Statstykiprojektrodzaj.all(), link: ""  });
});
router.get("/statstykiprojektstatus", async (ctx) => {
  
  console.log( await Statstykiprojektstatus.all())
  ctx.render("./statstykiprojektrodzaj.ejs", { data: { name: "statystyki projekty wg status", tytul: "statystyki projekty wg status"}, dane: await Statstykiprojektstatus.all(), link: ""  });
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
router.get("/osoby", async (ctx) => {

  ctx.render("./osoby.ejs", { data: { name: "osoby", tytul: "osoby" }, osoba: await Osoba.all() });
});
router.post('/osobypost', async ctx => {
  const body = await ctx.request.body({ type: 'form-data' })
  const data = await body.value.read()

  let tekst = 'błąd';
  console.log(data)

  if (typeof data.fields['idosoba'] === 'undefined' && typeof data.fields['imie'] == 'string'&& typeof data.fields['nazwisko'] == 'string'&& typeof data.fields['pesel'] == 'string'&& typeof data.fields['telefon'] == 'string') {
    tekst = ""
    try {
      await Osoba.create({ imie: data.fields['imie'] ,nazwisko: data.fields['nazwisko'] ,pesel: data.fields['pesel'] ,telefon: data.fields['telefon'] ,},)
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }

    tekst = tekst + "dodano " + data.fields['imie']+" "+ data.fields['nazwisko']+" "+ data.fields['pesel']+" "+ data.fields['telefon']
    console.log("dodajemy" + data.fields['nazwa_rodzaj'])
  } else if (typeof data.fields['zapisz'] != 'undefined'&&typeof data.fields['idosoba'] !== 'undefined' && typeof data.fields['imie'] == 'string'&& typeof data.fields['nazwisko'] == 'string'&& typeof data.fields['pesel'] == 'string'&& typeof data.fields['telefon'] == 'string') {
    tekst = ""
    try {
      await Osoba.where({ idosoba: data.fields['idosoba'] }).update({ imie: data.fields['imie'] ,nazwisko: data.fields['nazwisko'] ,pesel: data.fields['pesel'] ,telefon: data.fields['telefon'] ,},)

    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }

    tekst = tekst + " zmieniono na "  + data.fields['imie']+" "+ data.fields['nazwisko']+" "+ data.fields['pesel']+" "+ data.fields['telefon']

  } else if (typeof data.fields['usun'] != 'undefined'&&typeof data.fields['idosoba'] !== 'undefined') {
    tekst = ""
    try {
      await Osoba.deleteById(data.fields['idosoba'])
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }


    tekst = tekst + " usuniento " + data.fields['imie']+" "+ data.fields['nazwisko']+" "+ data.fields['pesel']+" "+ data.fields['telefon']
  }

  ctx.render("./info.ejs", { data: { name: "osoby", tytul: "osoby", abc: tekst, link: "osoby" } });
  // context.response.redirect('/rodzaje')
})
router.get("/magazyn_sor", async (ctx) => {
console.log(await Magazyn_sor.all())
  ctx.render("./magazyn_sor.ejs", { data: { name: "magazyn_sor", tytul: "magazyn_sor" }, Magazyn_sor: await Magazyn_sor.all(), osoba: await Osoba.all() });
});

router.post('/Magazyn_sorpost', async ctx => {
  const body = await ctx.request.body({ type: 'form-data' })
  const data = await body.value.read()

  let tekst = 'błąd';
  console.log(data)
 if (typeof data.fields['idmagazyn_sor'] === 'undefined' && typeof data.fields['powierzchnia'] == 'string'&& typeof data.fields['lokalizacja_gps_msor'] == 'string'&& typeof data.fields['osoba_idosoba'] == 'string'&& typeof data.fields['nazwa_magazyn_sor'] == 'string') {
    tekst = ""
    try {
      await Magazyn_sor.create({ powierzchnia: data.fields['powierzchnia'] ,lokalizacja_gps_msor: data.fields['lokalizacja_gps_msor'] ,osoba_idosoba: data.fields['osoba_idosoba'] ,nazwa_magazyn_sor: data.fields['nazwa_magazyn_sor'] ,},)
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }

     tekst = tekst + "dodano " + data.fields['powierzchnia']+" "+ data.fields['lokalizacja_gps_msor']+" "+ data.fields['nazwa_magazyn_sor']
    console.log("dodajemy")
  } else if (typeof data.fields['zapisz'] != 'undefined'&&typeof data.fields['idmagazyn_sor'] !== 'undefined' && typeof data.fields['powierzchnia'] == 'string'&& typeof data.fields['lokalizacja_gps_msor'] == 'string'&& typeof data.fields['osoba_idosoba'] == 'string'&& typeof data.fields['nazwa_magazyn_sor'] == 'string') {
    tekst = ""
    try {
      await Magazyn_sor.where({ idmagazyn_sor: data.fields['idmagazyn_sor'] }).update({ powierzchnia: data.fields['powierzchnia'] ,lokalizacja_gps_msor: data.fields['lokalizacja_gps_msor'] ,osoba_idosoba: data.fields['osoba_idosoba'] ,nazwa_magazyn_sor: data.fields['nazwa_magazyn_sor'] ,},)
    
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }

    tekst = tekst + " zmieniono na "  + data.fields['powierzchnia']+" "+ data.fields['lokalizacja_gps_msor']+" "+ data.fields['nazwa_magazyn_sor']

  } else if (typeof data.fields['usun'] != 'undefined'&&typeof data.fields['idosoba'] !== 'undefined') {
    tekst = ""
    try {
      await Osoba.deleteById(data.fields['idosoba'])
    } catch (error) {
      console.log(error)
      tekst = "Nie "
    }


    tekst = tekst + " usuniento " + data.fields['imie']+" "+ data.fields['nazwisko']+" "+ data.fields['pesel']+" "+ data.fields['telefon']
  }

  ctx.render("./info.ejs", { data: { name: "magazyn_sor", tytul: "magazyn_sor", abc: tekst, link: "magazyn_sor" } });
  // context.response.redirect('/rodzaje')
})


app.use(router.routes());
console.log("http://localhost")
await app.listen({ port: 80 });
