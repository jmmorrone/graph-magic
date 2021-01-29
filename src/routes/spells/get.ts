import { NextFunction, Request, Response } from 'express'
import logger from '../../configs/logger'
import getSpell from '../../controllers/spells/get'
import { sendResponse } from '../../helpers/responseFormat'

export default async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getSpell()
    sendResponse(res, 200, 'Spell list', result)

    return next()
  } catch (error) {
    logger.error('Error getting spell', error)
    return next(error)
  }
}
