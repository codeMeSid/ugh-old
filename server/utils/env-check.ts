import { errorlog } from "@monsid/ugh-og";

const {
  PORT,
  MONGO_URI,
  RAZORPAY_ID,
  RAZORPAY_SECRET,
  JWT_KEY,
  NODE_ENV,
  BASE_URL,
  EMAIL,
  PASSWORD,
  // TIMER_URL,
} = process.env;

if (!PORT) {
  errorlog("PORT is required");
  throw new Error();
}

if (!BASE_URL) {
  errorlog("BASE URL is required");
  throw new Error();
}

if (!MONGO_URI) {
  errorlog("MONGO_URI is required");
  throw new Error();
}

if (!JWT_KEY) {
  errorlog("JWT_KEY is required");
  throw new Error();
}

if (!RAZORPAY_ID) {
  errorlog("RAZORPAY_ID is required");
  throw new Error();
}

if (!RAZORPAY_SECRET) {
  errorlog("RAZORPAY_SECRET is required");
  throw new Error();
}

if (!EMAIL) {
  errorlog("EMAIL is required");
  throw new Error();
}

if (!PASSWORD) {
  errorlog("PASSWORD is required");
  throw new Error();
}
// if (!TIMER_URL) {
//   errorlog("PASSWORD is required");
//   throw new Error();
// }

export {
  PORT,
  MONGO_URI,
  RAZORPAY_ID,
  RAZORPAY_SECRET,
  JWT_KEY,
  NODE_ENV,
  BASE_URL,
  EMAIL,
  PASSWORD,
  // TIMER_URL,
};
