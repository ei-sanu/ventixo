import { randomInt } from "crypto";
import User from "../models/User.js";

const getMonthYearPrefix = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear()).slice(-2);

  return `${month}${year}`;
};

export const generateUserId = async () => {
  const prefix = getMonthYearPrefix();
  const maxAttempts = 25;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const suffix = String(randomInt(0, 10000)).padStart(4, "0");
    const candidate = `${prefix}${suffix}`;
    const exists = await User.exists({ userId: candidate });

    if (!exists) return candidate;
  }

  throw new Error("Unable to generate a unique userId");
};
