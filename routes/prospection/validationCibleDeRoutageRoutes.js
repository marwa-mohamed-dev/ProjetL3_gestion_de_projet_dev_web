const express = require('express')
const ValidationCiblederoutageController = require('../../controllers/prospection/validationCiblederoutageController')

const router = express.Router();

// Affiche les cibles de routage à valider
router.get('/', ValidationCiblederoutageController.cible_affiche)

// Récupère les informations de la cible de routage sélectionnée
router.get('/:id', ValidationCiblederoutageController.cible_getOne)

// Enregistre la remarque créée et changement de statut en cas de refus de la cible de routage
router.post('/:id', ValidationCiblederoutageController.cible_refus)

// Modifie le statut des individus inclus dans la cible de routage
router.put('/:id', ValidationCiblederoutageController.cible_valide_statutInd)

// Supprime la cible de routage sélectionnée
router.delete('/:id', ValidationCiblederoutageController.cible_delete)

module.exports = router;