import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL, // Now using the Docker network
});

redisClient.on("error", (err) => console.error("❌ Redis Error:", err));

(async () => {
  await redisClient.connect();
  console.log("✅ Connected to Redis");
})();

export default redisClient;
