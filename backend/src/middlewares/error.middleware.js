const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: "Page not found",
  });
};

const errorMiddleware = (err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMsg = err.message || "Something went wrong";
  const errStack = process.env.NODE_ENV === "production" ? null : err.stack;
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: errStack,
  });
};

export { notFound, errorMiddleware };
