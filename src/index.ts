import logger from './configs/logger'
import { server } from './server'

server.start().then(() => logger.info('Server listening at http://localhost:5000'))
