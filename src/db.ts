import { createServer } from 'http';
import { User } from './type';

class DataBase {
  db: User[];

  constructor() {
    this.db = [];
  }
  setDb(users: User[]) {
    this.db = users;
  }
  getDb() {
    return this.db;
  }
}

export const database = new DataBase();

export const dataBase = createServer((req, res) => {
  switch (req.method) {
    case 'GET':
      const users = database.getDb();
      res.end(JSON.stringify(users));
      break;

    case 'POST':
      let data = '';
      req.on('data', (chunk) => {
        data += chunk;
      });
      req.on('end', () => {
        database.setDb(JSON.parse(data));
      });
      res.end();
      break;

    default:
      res.end(null);
  }
});
