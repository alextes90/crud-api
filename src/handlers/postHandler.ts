import { IncomingMessage, ServerResponse } from "http";
import { User } from "../type";
import { bodyParser } from "../utils/bodyParser";
import { v4 } from "uuid";

export const postHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  db: User[]
) => {
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
    db.push({ id: v4(), ...validBody });
    res.writeHead(201, { "Content-Type": "application/json" });
    res.write(
      JSON.stringify({
        data: validBody,
      })
    );
    res.end();
  }
};
