import 'dotenv/config';
import { workerServer } from './server';
import { availableParallelism } from 'os';
import cluster from 'cluster';
import { createServer, request } from 'http';
import { dataBase } from './db';

const PORT = Number(process.env.PORT || 3000);

const args = process.argv;
const isMulti = args.includes('multi');
let count = 2;

if (isMulti) {
  const numberOfCluster = availableParallelism() - 1;
  const clustersArr = [...Array(numberOfCluster).keys()];

  if (cluster.isPrimary) {
    dataBase.listen(3001, () => {
      console.log(
        'Database is running on 3001 port. Go to http://localhost:3001'
      );
    });
    clustersArr.forEach((_, index) =>
      cluster.fork({ WORKER_PORT: PORT + index + 1 })
    );
    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.id} is finished`);
    });

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
            'Content-Type': 'application/json',
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
            'Content-Type': 'application/json',
          });
          res.write(bodyFromWorker);
          res.end();
        });

        reqToWorker.on('error', (err) => {
          console.error(err);
        });
        reqToWorker.write(body);
        reqToWorker.end();
        count = count + 1 > numberOfCluster ? 1 : count + 1;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
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
  dataBase.listen(3001, () => {
    console.log(
      'Database is running on 3001 port. Go to http://localhost:3001'
    );
  });
  workerServer(PORT);
}
