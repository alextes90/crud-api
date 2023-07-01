import { IncomingMessage, ServerResponse } from "http";
import { User } from "../type";
import { bodyParser } from "../utils/bodyParser";
import { validate } from "uuid";
import { BASE_API } from "../constants";

export const putHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  db: User[]
) => {
  const userId = req.url?.slice(BASE_API.length + 1) || "";
  const isValidUuid = validate(userId);

  if (!isValidUuid) {
    {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.write(JSON.stringify("Provided id is not a valid uuid"));
      res.end();
    }
  } else {
    const updatedUserIndex = db.findIndex(({ id }: User) => id === userId);
    if (updatedUserIndex === -1) {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify("User is not found"));
      res.end();
    } else {
      const validBody = await bodyParser(req);
      if (!validBody) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify(
            "body does not contain required field or you provide unnecessary information"
          )
        );
        res.end();
      } else {
        db[updatedUserIndex] = { id: userId, ...validBody };
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(
          JSON.stringify({
            data: validBody,
          })
        );
        res.end();
      }
    }
  }
};
