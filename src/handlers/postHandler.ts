import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../type';
import { bodyParser } from '../utils/bodyParser';
import { v4 } from 'uuid';
import { BASE_API } from '../constants';

export const postHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  db: User[]
) => {
  const validBody = await bodyParser(req);
  if (req.url !== BASE_API) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(`incorrect path, should be ${BASE_API}`));
    res.end();
  } else if (!validBody) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify(
        'body does not contain required field or you provide unnecessary information'
      )
    );
    res.end();
  } else {
    const newId = v4();
    db.push({ id: newId, ...validBody });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        data: { id: newId, ...validBody },
      })
    );
    res.end();
  }
};
