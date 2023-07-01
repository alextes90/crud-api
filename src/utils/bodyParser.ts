import { IncomingMessage } from "http";
import { validateJSON } from "./validateJSON";
import { bodyValidator } from "./bodyValidator";

export const bodyParser = async (req: IncomingMessage) => {
  const bodyArr = [];

  for await (const chunk of req) {
    bodyArr.push(chunk.toString());
  }

  const body = validateJSON(bodyArr.join());
  const isValidBody = bodyValidator(body);

  return isValidBody ? body : false;
};
