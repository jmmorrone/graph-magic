import { SpellModel } from '../../models/spell'

export default async () => {
  return (await SpellModel.all()).toJson()
}
