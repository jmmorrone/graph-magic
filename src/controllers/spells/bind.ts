import errors from '../../configs/errors'
import logger from '../../configs/logger'
import { SpellModel } from '../../models/spell'

export default async (originSpellId: string, sourceSpellId: string) => {
  if (originSpellId === sourceSpellId) {
    throw errors.SameSpellIDError
  }
  const origin = await SpellModel.find(originSpellId)
  const source = await SpellModel.find(sourceSpellId)

  if (!origin || !source) {
    throw errors.SpellNotFound
  }

  try {
    const binded = await origin.relateTo(source, 'requires')
    return binded.toJson()
  } catch (error) {
    logger.error('Error binding spells', error)
    throw errors.ErrorBindingSpells
  }
}
