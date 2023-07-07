import { IncomingMessage, ServerResponse } from 'http';
import { User } from '../type';
import { BASE_API } from '../constants';
import { validate } from 'uuid';

export const deleteHandler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  const userId = req.url?.slice(BASE_API.length + 1) || '';
  const isValidUuid = validate(userId);

  const response = await fetch('http://localhost:3001');
  const db = await response.json();

  if (!isValidUuid) {
    {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify('Provided id is not a valid uuid'));
      res.end();
    }
  } else {
    const [user] = db.filter(({ id }: User) => id === userId);
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify('User is not found'));
      res.end();
    } else {
      const deletedUserIndex = db.findIndex(({ id }: User) => id === userId);
      db.splice(deletedUserIndex, 1);
      const newDb = [...db];
      await fetch('http://localhost:3001', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDb),
      });
      res.writeHead(204, { 'Content-Type': 'application/json' });
      res.end();
    }
  }
};
