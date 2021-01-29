import logger from './logger'

export default (err, _req, res, next) => {
  logger.error(err)
  if (res.headersSent) {
    return next(err)
  }
  return res.status(err.status || 500).send({
    name: err.name || 'InternalServerError',
    status: err.status || 500,
    message: err.message || 'Something went wrong.'
  })
}
