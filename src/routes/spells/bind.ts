import { NextFunction, Request, Response } from 'express'
import logger from '../../configs/logger'
import bindSpells from '../../controllers/spells/bind'
import { sendResponse } from '../../helpers/responseFormat'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body, params } = req
    const { spell_id: originSpellId } = params
    const { spell_id: sourceSpellId } = body

    const binding = await bindSpells(originSpellId, sourceSpellId)
    sendResponse(res, 200, 'Spells bound', { binding })

    return next()
  } catch (error) {
    logger.error('Error connecting the spells', error)
    return next(error)
  }
}
