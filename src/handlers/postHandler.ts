import { IncomingMessage, ServerResponse } from 'http';
import { bodyParser } from '../utils/bodyParser';
import { v4 } from 'uuid';
import { BASE_API } from '../constants';

export const postHandler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const validBody = await bodyParser(req);
  const response = await fetch('http://localhost:3001');
  const db = await response.json();

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
    const newDb = [...db, { id: newId, ...validBody }];
    await fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newDb),
    });
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.write(
      JSON.stringify({
        data: { id: newId, ...validBody },
      })
    );
    res.end();
  }
};
