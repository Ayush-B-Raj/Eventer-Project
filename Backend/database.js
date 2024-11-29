const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // MySQL server host
  user: 'root',      // MySQL username (default is 'root' for XAMPP)
  password: '',      // MySQL password (default is empty for XAMPP)
  database: 'micro' // Name of the database you're using
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

module.exports = connection

