import "dotenv/config";
import { createServer } from "http";
import { BASE_API } from "./constants";
import { getHandler } from "./handlers/getHandler";
import { postHandler } from "./handlers/postHandler";
import { db } from "./db";
import { putHandler } from "./handlers/putHandler";
import { deleteHandler } from "./handlers/deleteHandler";

const PORT = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const method = req.method;
  const url = req.url;
  try {
    if (url === BASE_API || url?.startsWith(`${BASE_API}/`)) {
      switch (method) {
        case "GET":
          getHandler(req, res, db);
          break;
        case "POST":
          await postHandler(req, res, db);
          break;
        case "PUT":
          await putHandler(req, res, db);
          break;
        case "PUT":
          await putHandler(req, res, db);
          break;
        case "DELETE":
          deleteHandler(req, res, db);
          break;
        default:
          res.writeHead(500, { "Content-Type": "application/json" });
          res.write(JSON.stringify("Method is not implemented"));
          res.end();
      }
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.write(JSON.stringify("404 Not Found"));
      res.end();
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.write(JSON.stringify(`${err}`));
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(
    `Server is running on ${PORT} post. Go to http://localhost:${PORT}/`
  );
});

// server.close();
