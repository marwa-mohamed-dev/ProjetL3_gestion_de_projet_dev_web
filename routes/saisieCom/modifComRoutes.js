const express = require('express');
const modifComController = require('../../controllers/saisieCom/modifComController')

const router = express.Router();

router.get('/', modifComController.modifCom_recherche)

module.exports= router;