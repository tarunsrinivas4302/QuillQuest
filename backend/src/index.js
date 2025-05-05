import cluster from "cluster";
import os from "os";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      ...process.env,
      IS_EMAIL_WORKER: i === 0 ? "true" : "false" 
    });
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  import("./app.js").then(() => {
    console.log(`Worker ${process.pid} started`);
  });
}
