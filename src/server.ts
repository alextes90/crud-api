import { createServer } from 'http';
import { BASE_API } from './constants';
import { getHandler } from './handlers/getHandler';
import { postHandler } from './handlers/postHandler';
import { db } from './db';
import { putHandler } from './handlers/putHandler';
import { deleteHandler } from './handlers/deleteHandler';

export const workerServer = (port: number | string) => {
  const PORT = port;
  const server = createServer(async (req, res) => {
    const { method, url } = req;
    try {
      if (url === '/') {
        res.writeHead(200);
        res.end();
      } else if (url === BASE_API || url?.startsWith(`${BASE_API}/`)) {
        switch (method) {
          case 'GET':
            getHandler(req, res, db);
            break;
          case 'POST':
            await postHandler(req, res, db);
            break;
          case 'PUT':
            await putHandler(req, res, db);
            break;
          case 'PUT':
            await putHandler(req, res, db);
            break;
          case 'DELETE':
            deleteHandler(req, res, db);
            break;
          default:
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify('Method is not implemented'));
            res.end();
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify('404 Not Found'));
        res.end();
      }
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify(`${err}`));
      res.end();
    }
  });

  server.listen(PORT, () => {
    console.log(
      `Server is running on ${PORT} port. Go to http://localhost:${PORT}`
    );
  });
};

// server.close();
