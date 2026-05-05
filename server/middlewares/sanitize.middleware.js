const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce((clean, [key, nestedValue]) => {
      if (key.startsWith("$") || key.includes(".")) {
        return clean;
      }

      clean[key] = sanitizeValue(nestedValue);
      return clean;
    }, {});
  }

  return value;
};

export const sanitizeInput = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);

  next();
};
