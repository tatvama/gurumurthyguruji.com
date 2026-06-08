const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR:`, err.message);

  if (err.code === "23505") {
    return res.status(409).json({ success: false, message: "Duplicate entry." });
  }

  if (err.code === "ECONNREFUSED" || err.code === "57P01") {
    return res.status(503).json({ success: false, message: "Database unavailable. Please try again." });
  }

  const status = err.statusCode || err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
