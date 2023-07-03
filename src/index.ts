import "dotenv/config";
import { workerServer } from "./server";
import { availableParallelism } from "os";
import cluster from "cluster";
import { createServer, request } from "http";

const PORT = Number(process.env.PORT || 3000);

const args = process.argv;
const isMulti = args.includes("multi");

if (isMulti) {
  const numberOfCluster = availableParallelism();
  const clustersArr = [...Array(numberOfCluster).keys()];

  if (cluster.isPrimary) {
    clustersArr.forEach((_, index) =>
      cluster.fork({ WORKER_PORT: PORT + index + 1 })
    );
    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.id} is finished`);
    });

    let count = 1;
    const balancer = createServer(async (req, res) => {
      try {
        const bodyArr = [];

        for await (const chunk of req) {
          bodyArr.push(chunk.toString());
        }

        const body = bodyArr.join();

        const reqOptions = {
          port: Number(PORT) + count,
          path: req.url,
          method: req.method,
          headers: {
            "Content-Type": "application/json",
          },
        };

        const reqToWorker = request(reqOptions, async (resFromWorker) => {
          const bodyArr = [];

          for await (const chunk of resFromWorker) {
            bodyArr.push(chunk.toString());
          }

          let bodyFromWorker = bodyArr.join();
          const statusCode = resFromWorker.statusCode || 500;
          res.writeHead(statusCode, {
            "Content-Type": "application/json",
          });
          res.write(bodyFromWorker);
          res.end();
        });

        reqToWorker.on("error", (err) => {
          console.error(err);
        });
        reqToWorker.write(body);
        reqToWorker.end();
        count = count + 1 > numberOfCluster ? count + 1 : 1;
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(JSON.stringify(`${err}`));
        res.end();
      }
    });
    balancer.listen(PORT, () => {
      console.log(`Balancer is listening PORT ${PORT}`);
    });
  } else if (cluster.isWorker) {
    const port = Number(process.env.WORKER_PORT);
    console.log(`Worker ${cluster.worker?.id} is listening PORT ${port}`);
    workerServer(port);
  }
} else {
  workerServer(PORT);
}
