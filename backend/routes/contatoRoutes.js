const { Router } = require('express');

const { createContato, listContatos } = require('../controllers/contatoController');

const router = Router();

router.get('/contato', listContatos);
router.post('/contato', createContato);

module.exports = router;