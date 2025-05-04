const express = require('express');

// Importing the controller
const router = express.Router();
const purchasedAssetController = require('../controller/purchased_asset.controller');

router.get('/', purchasedAssetController.findAll); // Get all purchased assets
router.get('/:portfolio_id/:instrument_id', purchasedAssetController.findByID); // Get purchased asset by portfolio_id and instrument_id
router.post('/', purchasedAssetController.create); // Create new purchased asset
router.put('/:portfolio_id/:instrument_id', purchasedAssetController.update); // Update purchased asset by portfolio_id and instrument_id
router.delete('/:portfolio_id/:instrument_id', purchasedAssetController.delete); // Delete purchased asset by portfolio_id and instrument_id

module.exports = router;