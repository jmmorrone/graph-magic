import { SpellModel, Spell } from '../../models/spell'

export default async (body) => {
  const spell: Spell = {
    elemental_type: body.elemental_type,
    mana_cost: body.mana_cost,
    name: body.name
  }
  const createdSpell = await SpellModel.create(spell)
  return createdSpell.toJson()
}
