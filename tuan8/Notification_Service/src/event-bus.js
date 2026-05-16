const { createClient } = require("redis");

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let subscriber = null;

async function getSubscriber() {
  if (subscriber) return subscriber;
  try {
    subscriber = createClient({ url: REDIS_URL });
    await subscriber.connect();
    console.log("Subscriber connected to Redis");
    return subscriber;
  } catch (error) {
    console.error("Failed to connect subscriber to Redis", error);
    throw error;
  }
}

async function subscribeToEvent(channel, callback) {
  const s = await getSubscriber();
  await s.subscribe(channel, (message) => {
    try {
      const data = JSON.parse(message);
      callback(data);
    } catch (err) {
      console.error("Failed to parse message", message);
    }
  });
  console.log(`[Event] Subscribed to ${channel}`);
}

module.exports = { subscribeToEvent };
