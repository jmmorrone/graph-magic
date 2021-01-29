import { Response } from 'express'

export const sendResponse = (res: Response, code: number, info: string, data?: object | null): void => {
  res.status(code).send({
    result: {
      code,
      info
    },
    data
  })
}
