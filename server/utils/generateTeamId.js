import { randomInt } from "crypto";
import Team from "../models/Team.js";

export const generateTeamId = async () => {
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = String(randomInt(100000, 1000000)); // 6 digit code
    const exists = await Team.exists({ teamId: candidate });

    if (!exists) return candidate;
  }

  throw new Error("Unable to generate a unique teamId");
};
