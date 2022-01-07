import { Database, MySQLConnector } from 'https://deno.land/x/denodb/mod.ts';

const connector = new MySQLConnector({
  database: 'my-database',
  host: 'url-to-db.com',
  username: 'username',
  password: 'password',
  port: 3306, // optional
});

const db = new Database(connector);