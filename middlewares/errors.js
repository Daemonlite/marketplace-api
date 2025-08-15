export function handleError(error, req, res, next) {
  res.status(error.statusCode || 500).send({ message: error.message });
}