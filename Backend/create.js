const connection = require('./database.js');

// Create a table
const createTableQuery = `
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each user
    name VARCHAR(255) NOT NULL,        -- Full name of the user
    address TEXT,                      -- Address of the user
    dob DATE NOT NULL,                 -- Date of Birth
    phone VARCHAR(15) NOT NULL,        -- Phone number
    email VARCHAR(255) UNIQUE NOT NULL, -- Email address (must be unique)
    password VARCHAR(255) NOT NULL    -- Password field
);
`;

connection.query(createTableQuery, (err, results) => {
  if (err) {
    console.error('Error creating table:', err);
    return;
  }
  console.log('Table "users" created successfully');
});
