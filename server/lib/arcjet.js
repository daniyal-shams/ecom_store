import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import "dotenv/config";

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE"],
    }),
    // Create a token bucket rate limit. Other algorithms are supported.
    tokenBucket({
      mode: "LIVE",
      refillRate: 30, // Refill 5 tokens per interval
      interval: 5, // Refill every 10 seconds
      capacity: 20, // Bucket capacity of 10 tokens
    }),
  ],
});
