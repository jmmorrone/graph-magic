import { Elements } from '../../../src/models/spell'
import apiRequest from '../helpers/apiRequest'
import '../helpers/hook'

const createSpell = async (args?) => {
  const body = {
    elemental_type: args?.elemental_type || Elements.FIRE,
    mana_cost: args?.mana_cost || 10,
    name: args?.name || 'Fireball'
  }

  const { data } = await apiRequest.post('/api/v1/spells', body)
  return data
}

const getSpells = async () => {
  const { data } = await apiRequest.get('/api/v1/spells')
  return data
}

const connectSpells = async (originId: string, destinationId: string) => {
  const body = {
    spell_id: destinationId
  }

  const { data } = await apiRequest.put(`/api/v1/spells/${originId}/bind`, body)
  return data
}

describe('Spell APIs', () => {
  test('Create new spell', async () => {
    const { result, data } = await createSpell()

    expect(result).toStrictEqual({
      code: 201,
      info: 'Spell created'
    })
    expect(data).toMatchObject({
      name: 'Fireball',
      mana_cost: 10,
      elemental_type: Elements.FIRE
    })
    expect(data.id).toBeDefined()
  })

  test('Get all spells', async () => {
    const names = ['Ice Lance', 'Earthquake', 'Flight', 'Lava Burst']
    for (const name of names) {
      await createSpell({ name })
    }

    const { result, data } = await getSpells()

    expect(result).toStrictEqual({
      code: 200,
      info: 'Spell list'
    })
    expect(data).toHaveLength(4)
    expect(data).toMatchObject([{
      name: names[0],
      mana_cost: 10,
      elemental_type: Elements.FIRE
    }, {
      name: names[1],
      mana_cost: 10,
      elemental_type: Elements.FIRE
    }, {
      name: names[2],
      mana_cost: 10,
      elemental_type: Elements.FIRE
    }, {
      name: names[3],
      mana_cost: 10,
      elemental_type: Elements.FIRE
    }])
  })

  test('Connect two spells', async () => {
    const names = ['Meteor', 'Fireball']
    const ids: any = []
    for (const name of names) {
      const { data: { id } } = await createSpell({ name })
      ids.push(id)
    }
    const { result, data } = await connectSpells(ids[0], ids[1])

    expect(result).toMatchObject({
      code: 200,
      info: 'Spells bound'
    })
    expect(data).toMatchObject({
      name: 'Chewie',
      mana_cost: 10,
      elemental_type: Elements.FIRE
    })
  })

  test('Fail connecting two spells: spell does not exist', async () => {
    const names = ['Chewie', 'Han']
    const ids: any = []
    for (const name of names) {
      const { data: { id } } = await createSpell({ name })
      ids.push(id)
    }
    const response = await connectSpells(ids[0], 'FakeId')

    expect(response).toMatchObject({
      name: 'SpellNotFound',
      status: 404,
      message: 'Spell does not exist'
    })
  })

  test('Fail connecting two spells: same spell ID', async () => {
    const { data: { id } } = await createSpell()
    const response = await connectSpells(id, id)

    expect(response).toMatchObject({
      name: 'SameSpellIDError',
      status: 403,
      message: 'Cannot connect the same spell'
    })
  })
})
