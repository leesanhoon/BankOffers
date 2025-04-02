const express = require('express');
const router = express.Router();
const { parseCSV, searchCards } = require('../utils/csvParser');
const path = require('path');

const csvFilePath = path.join(__dirname, '../data/bank.csv');

let cardData = null;

// Load data on startup
parseCSV(csvFilePath)
  .then(data => {
    cardData = data;
    console.log('CSV data loaded successfully');
  })
  .catch(err => {
    console.error('Error loading CSV data:', err);
  });

// Get all cards
router.get('/cards', (req, res) => {
  if (!cardData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  res.json(cardData);
});

// Search cards
router.get('/cards/search', (req, res) => {
  if (!cardData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  const results = searchCards(cardData, q);
  res.json(results);
});

// Get cards by bank
router.get('/cards/bank/:bankName', (req, res) => {
  if (!cardData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  const bankName = req.params.bankName.toLowerCase();
  const results = cardData.filter(card => {
    const cardName = card.Card || '';
    return cardName.toLowerCase().includes(bankName);
  });
  
  res.json(results);
});

// Get cards by category
router.get('/cards/category/:category', (req, res) => {
  if (!cardData) {
    return res.status(503).json({ error: 'Data not loaded yet' });
  }
  
  const category = req.params.category.toLowerCase();
  const results = cardData.filter(card => {
    const cardCategory = card['Thể loại'] || '';
    return cardCategory.toLowerCase().includes(category);
  });
  
  res.json(results);
});

module.exports = router;