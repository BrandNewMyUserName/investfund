const express = require('express');

// Importing the controller
const router = express.Router();
const instrumentController = require('../controller/instrument.controller');

router.get('/', instrumentController.findAll); // Get all instruments
router.get('/:instrument_id', instrumentController.findByID); // Get instrument by ID
router.post('/', instrumentController.create); // Create new instrument
router.put('/:instrument_id', instrumentController.update); // Update instrument by ID
router.delete('/:instrument_id', instrumentController.delete); // Delete instrument by ID

module.exports = router;