import { instance } from '../../../src/models/database'

export default async (): Promise<void> => instance.deleteAll('Spell')
