import { v4 } from 'uuid'

import { instance } from './database'

export const Elements = {
  FIRE: 'fire',
  WATER: 'water',
  AIR: 'air',
  EARTH: 'earth'
}

export interface Spell {
  id?: string,
  name: string,
  mana_cost: number,
  elemental_type: typeof Elements
}

export const SpellModel = instance.model<Spell>('Spell', {
  id: {
    primary: true,
    type: 'uuid',
    required: true,
    default: () => v4()
  },
  name: {
    type: 'string',
    required: true,
  },
  mana_cost: {
    type: 'int',
    required: true
  },
  elemental_type: {
    type: 'string',
    required: true
  }
})
