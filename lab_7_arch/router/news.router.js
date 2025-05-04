const express = require('express');

// Importing the controller
const router = express.Router();
const newsController = require('../controller/news.controller');

router.get('/', newsController.findAll); // Get all news
router.get('/:news_id', newsController.findByID); // Get news by ID
router.post('/', newsController.create); // Create new news
router.put('/:news_id', newsController.update); // Update news by ID
router.delete('/:news_id', newsController.delete); // Delete news by ID

module.exports = router;