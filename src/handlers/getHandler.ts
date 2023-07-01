import { IncomingMessage, ServerResponse } from "http";
import { User } from "../type";
import { BASE_API } from "../constants";
import { validate } from "uuid";

export const getHandler = (
  req: IncomingMessage,
  res: ServerResponse,
  db: User[]
) => {
  if (req.url === BASE_API) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        data: db,
      })
    );
    res.end();
  } else {
    const userId = req.url?.slice(BASE_API.length + 1) || "";
    const isValidUuid = validate(userId);

    if (!isValidUuid) {
      {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(JSON.stringify("Provided id is not a valid uuid"));
        res.end();
      }
    } else {
      const [user] = db.filter(({ id }: User) => id === userId);
      if (!user) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.write(JSON.stringify("User is not found"));
        res.end();
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify({ data: user }));
        res.end();
      }
    }
  }
};
