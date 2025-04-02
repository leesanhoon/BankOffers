const fs = require('fs');
const csv = require('csv-parser');

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (data) => {
        // Clean up the data
        const cleanedData = {};
        for (const key in data) {
          if (data[key] !== '') {
            cleanedData[key] = data[key];
          }
        }
        results.push(cleanedData);
      })
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const searchCards = (data, query) => {
  const searchTerm = query.toLowerCase();
  
  return data.filter(card => {
    // Search in card name, card type, cashback type, category, etc.
    return (
      (card.Card && card.Card.toLowerCase().includes(searchTerm)) ||
      (card['Card Type'] && card['Card Type'].toLowerCase().includes(searchTerm)) ||
      (card['Loại hoàn tiền'] && card['Loại hoàn tiền'].toLowerCase().includes(searchTerm)) ||
      (card['Thể loại'] && card['Thể loại'].toLowerCase().includes(searchTerm)) ||
      (card['Mã MCC'] && card['Mã MCC'].toLowerCase().includes(searchTerm)) ||
      (card.Note && card.Note.toLowerCase().includes(searchTerm))
    );
  });
};

module.exports = { parseCSV, searchCards };