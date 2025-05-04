const express = require('express');

// Importing the controller
const router = express.Router();
const portfolioController = require('../controller/portfolio.controller');

router.get('/', portfolioController.findAll); // Get all users
router.get('/:portfolio_id', portfolioController.findByID); // Get portfolio by ID
router.post('/', portfolioController.create); // Create new portfolio
router.put('/:portfolio_id', portfolioController.update); // Update portfolio by ID
router.delete('/:portfolio_id', portfolioController.delete); // Delete portfolio by ID

module.exports = router;