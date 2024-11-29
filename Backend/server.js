const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // MySQL password
  database: "micro", // Your database name
});

const multer = require('multer');

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');  // Path to save uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Unique filename
  }
});



const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit (adjust as necessary)
});



app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      res.status(500).send("Error fetching users");
    } else {
      res.json(results);
    }
  });
});


// Check connection to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// API endpoint to handle form data submission (Register)
app.post("/submit", (req, res) => {
  const { name, address, dob, phone, email, password } = req.body;

  // Hash the password before saving it to the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      res.status(500).send("Error hashing password");
      return;
    }

    const query = 'INSERT INTO users (name, address, dob, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)';

    db.query(
      query,
      [name, address, dob, phone, email, hashedPassword],
      (err, result) => {
        if (err) {
          console.error("Error inserting data:", err);
          res.status(500).send("Error inserting data");
          return;
        }
        res.status(200).send("Form data inserted successfully");
      }
    );
  });
});

// API endpoint to handle login (validate email and password)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).send({ success: false, message: "Internal server error" });
    }

    if (results.length > 0) {
      const user = results[0];

      // Compare the entered password with the hashed password in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send({ success: false, message: "Internal server error" });
        }

        if (isMatch) {
          // If the password matches, send the user data including the admin status
          res.send({
            success: true,
            user: {
              ...user,  // Include all user details
              admin: user.admin === 1, // Add admin flag
            }
          });
        } else {
          res.send({ success: false, message: "Invalid email or password" });
        }
      });
    } else {
      res.send({ success: false, message: "Invalid email or password" });
    }
  });
});

// API endpoint for uploading event data (including the file)
app.post("/upload", upload.single('eventPhoto'), (req, res) => {
  const { eventName, price, duration, contact, Details } = req.body;
  const eventPhoto = req.file;

  if (!eventPhoto) {
    return res.status(400).send("Event photo is required.");
  }

  // Save event data to the tbl_upload table along with the file path
  const query =
    "INSERT INTO tbl_upload (event_name, event_photo, price, duration, contact, details) VALUES (?, ?, ?, ?, ?, ?)";

  const eventPhotoPath = `/uploads/${eventPhoto.filename}`; // Relative path to the uploaded file

  db.query(
    query,
    [eventName, eventPhotoPath, price, duration, contact, Details],
    (err, result) => {
      if (err) {
        console.error("Error inserting event data:", err);
        return res.status(500).send("Error uploading event.");
      }
      res.status(200).send({ success: true, message: "Event uploaded successfully!" });
    }
  );
});



app.use('/uploads', express.static('uploads'));

app.get("/events", (req, res) => {
  const query = "SELECT * FROM tbl_upload";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).send("Error fetching events.");
    }
    res.json(results);
  });
});

// API endpoint to delete an event by ID
app.delete("/events/:id", (req, res) => {
  const eventId = req.params.id;

  // Delete the event record from the database
  const query = "DELETE FROM tbl_upload WHERE id = ?";
  db.query(query, [eventId], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).send("Error deleting event.");
    }
    if (result.affectedRows > 0) {
      res.status(200).send({ success: true, message: "Event deleted successfully!" });
    } else {
      res.status(404).send("Event not found.");
    }
  });
});





// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
