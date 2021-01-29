import { server } from '../../../src/server'
import dropDb from './dropDb'

beforeAll(async () => {
  await server.start()
})

beforeEach(async () => {
  await dropDb()
})

afterAll(async () => {
  await server.stop()
})
