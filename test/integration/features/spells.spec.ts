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

// const getSpellSuggestions = async (spellId: string) => {
//   const { data } = await apiRequest.get(`/api/v1/spells/${spellId}/suggestions`)
//   return data
// }

const connectSpells = async (originId: string, destinationId: string) => {
  const body = {
    spell_id: destinationId
  }

  const { data } = await apiRequest.put(`/api/v1/spells/${originId}/bind`, body)
  return data
}

// Since it's a microservice, I decided to create all test cases in the same file.
// Usually I'd rather split this in features for future maintainability.
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

  // test('Get suggestions for spell', async () => {
  //   const names = ['Ross', 'Chandler', 'Monica', 'Joey', 'Rachel', 'Phoebe']
  //   const ids: any = []
  //   for (const name of names) {
  //     const { data: { id } } = await createSpell({ name })
  //     ids.push(id)
  //   }
  //   // Ross is friends with Chandler and Monica
  //   await connectSpells(ids[0], ids[1])
  //   await connectSpells(ids[0], ids[2])

  //   // Chandler is friends with Ross and Joey (no rating)
  //   await connectSpells(ids[1], ids[3])

  //   // Phoebe is friends with Chandler and Monica (rating: 2)
  //   await connectSpells(ids[5], ids[1])
  //   await connectSpells(ids[5], ids[2])

  //   // Joey is friends with Chandler and Rachel (rating: 1)
  //   await connectSpells(ids[3], ids[4])

  //   const { result, data } = await getSpellSuggestions(ids[0])
  //   expect(result).toMatchObject({
  //     code: 200,
  //     info: 'Suggested spells list'
  //   })
  //   expect(data).toMatchObject([{
  //     connection: {
  //       isPrivate: false,
  //       connections: [ids[1], ids[2]],
  //       name: 'Phoebe'
  //     },
  //     rating: 2
  //   }, {
  //     connection: {
  //       isPrivate: false,
  //       connections: [ids[1], ids[4]],
  //       name: 'Joey'
  //     },
  //     rating: 1
  //   }, {
  //     connection: {
  //       isPrivate: false,
  //       connections: [ids[3]],
  //       name: 'Rachel'
  //     },
  //     rating: 0
  //   }])
  // })

  // test('Get suggestions for spell ommitting private spells', async () => {
  //   const friends = [
  //     { name: 'Ross' },
  //     { name: 'Chandler' },
  //     { name: 'Monica' },
  //     { name: 'Joey', isPrivate: true },
  //     { name: 'Rachel' },
  //     { name: 'Phoebe' }
  //   ]
  //   const ids: any = []
  //   for (const friend of friends) {
  //     const { data: { id } } = await createSpell(friend)
  //     ids.push(id)
  //   }
  //   // Ross is friends with Chandler and Monica
  //   await connectSpells(ids[0], ids[1])
  //   await connectSpells(ids[0], ids[2])

  //   // Chandler is friends with Ross and Joey (no rating)
  //   await connectSpells(ids[1], ids[3])

  //   // Phoebe is friends with Chandler and Monica (rating: 2)
  //   await connectSpells(ids[5], ids[1])
  //   await connectSpells(ids[5], ids[2])

  //   // Joey is friends with Chandler and Rachel (rating: 1) but it won't show because its private
  //   await connectSpells(ids[3], ids[4])

  //   const { result, data } = await getSpellSuggestions(ids[0])
  //   expect(result).toMatchObject({
  //     code: 200,
  //     info: 'Suggested spells list'
  //   })
  //   expect(data).toMatchObject([{
  //     connection: {
  //       isPrivate: false,
  //       connections: [ids[1], ids[2]],
  //       name: 'Phoebe'
  //     },
  //     rating: 2
  //   }, {
  //     connection: {
  //       isPrivate: false,
  //       connections: [ids[3]],
  //       name: 'Rachel'
  //     },
  //     rating: 0
  //   }])
  // })

  // test('Get suggestions for spell: fails because spell does not exist', async () => {
  //   const response = await getSpellSuggestions('FakeId')

  //   expect(response).toMatchObject({
  //     name: 'SpellNotFound',
  //     status: 404,
  //     message: 'Spell does not exist'
  //   })
  // })
})
