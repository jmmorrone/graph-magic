import { NextFunction, Request, Response } from 'express'
import logger from '../../configs/logger'
import createSpell from '../../controllers/spells/create'
import { sendResponse } from '../../helpers/responseFormat'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await createSpell(req.body)
    sendResponse(res, 201, 'Spell created', result)

    return next()
  } catch (error) {
    logger.error('There was an error casting the spell', error)
    return next(error)
  }
}
