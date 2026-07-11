const { Router } = require('express');

const { createContato } = require('../controllers/contatoController');

const router = Router();

router.post('/contato', createContato);

module.exports = router;