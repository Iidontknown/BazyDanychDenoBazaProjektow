//   await Rodzaj.create({ nazwa_rodzaj: 'Amelia' });
const tabela= await Rodzaj.all();
tabela.forEach(element => {
  console.log(element+"/") 
});
const tabelas= await Status.all();
tabelas.forEach(element => {
  console.log(element.nazwa_status+"/"+element.id_status) 
});





const db = new Database(connector);
db.link([Rodzaj]);
db.link([Status]);
db.link([Projekt]);
await db.sync();
console.log(await Status.all())
console.log(await Rodzaj.all())
console.log(await Projekt.all())

await Rodzaj.deleteById('3').then(console.error);