import { Router } from 'express'

import createSpell from './spells/create'
import getSpells from './spells/get'
import bindSpells from './spells/bind'

const router = Router()

router.get('/api/v1/spells', getSpells)
router.post('/api/v1/spells', createSpell)
router.put('/api/v1/spells/:spell_id/bind', bindSpells)

export default router
