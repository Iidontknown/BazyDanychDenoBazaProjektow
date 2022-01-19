import {  MySQLConnector} from 'https://deno.land/x/denodb/mod.ts';
const connector = new MySQLConnector({
  database: 'AplikacjaProjekty',
  host: 'localhost',
  username: 'root',
  password: 'MyNewPass',
  port: 3306, // optional
});
const connectorEzor = new MySQLConnector({
  database: 'mydb',
  host: 'localhost',
  username: 'root',
  password: 'MyNewPass',
  port: 3306, // optional
});
export{connector,connectorEzor}