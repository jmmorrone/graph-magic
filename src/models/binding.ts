import { instance } from './database'

export const BindingModel = instance.model('Spell').relationship('requires', 'relationship', 'REQUIRES', 'in', 'Spell')
