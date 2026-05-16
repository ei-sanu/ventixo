const log = (level, message, meta) => {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(meta ? { meta } : {}),
  };

  let output;
  try {
    output = JSON.stringify(payload);
  } catch (error) {
    // Fallback for circular references or other stringify issues
    output = JSON.stringify({
      level,
      message,
      timestamp: payload.timestamp,
      error: "Log payload contains circular references",
    });
  }

  if (level === "error") {
    console.error(output);
    return;
  }

  if (level === "warn") {
    console.warn(output);
    return;
  }

  console.log(output);
};

export const logger = {
  info: (message, meta) => log("info", message, meta),
  warn: (message, meta) => log("warn", message, meta),
  error: (message, meta) => log("error", message, meta),
};
