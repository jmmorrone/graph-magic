import express, { Express } from 'express'

import routes from './routes'
import errorHandler from './configs/errorHandler'
import { instance } from './models/database'

export class HttpServer {
  private app: Express
  private server

  constructor() {
    this.app = express()

    this.app.use(express.json())
    this.app.use(routes)
    this.app.use(errorHandler)
  }

  public start = async () => {
    this.server = this.app.listen(5000)
    return this.server
  }

  public stop = async () => {
    await instance.close()
    this.server.close()
  }
}

export const server = new HttpServer()
