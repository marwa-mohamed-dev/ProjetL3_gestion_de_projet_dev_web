const express = require('express');
const modifComController = require('../../controllers/SaisieCom/modifComController')

const router = express.Router();

router.get('/', modifComController.modifCom_recherche)

module.exports= router;