const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

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

// Check connection to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// Serve static files from the "uploads" directory
app.use("/uploads", express.static("uploads"));

// API to fetch users
app.get("/users", (req, res) => {
  const query = "SELECT * FROM users WHERE admin = 0"; // Only non-admin users
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching users:", err);
      return res.status(500).send("Error fetching users");
    }
    res.json(results);
  });
});

// User registration
app.post("/submit", (req, res) => {
  const { name, address, dob, phone, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).send("Error hashing password");
    }

    const query =
      "INSERT INTO users (name, address, dob, phone, email, password) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(query, [name, address, dob, phone, email, hashedPassword], (err) => {
      if (err) {
        console.error("Error inserting user data:", err);
        return res.status(500).send("Error inserting user data");
      }
      res.status(200).send("User registered successfully");
    });
  });
});

// User login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error during login:", err);
      return res.status(500).send("Internal server error");
    }

    if (results.length > 0) {
      const user = results[0];

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          return res.status(500).send("Internal server error");
        }

        if (isMatch) {
          res.send({ success: true, user });
        } else {
          res.send({ success: false, message: "Invalid email or password" });
        }
      });
    } else {
      res.send({ success: false, message: "Invalid email or password" });
    }
  });
});

// Upload event
app.post("/upload", upload.single("eventPhoto"), (req, res) => {
  const { eventName, price, duration, contact, Details } = req.body;
  const eventPhoto = req.file;

  if (!eventPhoto) {
    return res.status(400).send("Event photo is required.");
  }

  const query =
    "INSERT INTO tbl_upload (event_name, event_photo, price, duration, contact, details) VALUES (?, ?, ?, ?, ?, ?)";
  const eventPhotoPath = `/uploads/${eventPhoto.filename}`;

  db.query(query, [eventName, eventPhotoPath, price, duration, contact, Details], (err) => {
    if (err) {
      console.error("Error inserting event data:", err);
      return res.status(500).send("Error uploading event.");
    }
    res.status(200).send({ success: true, message: "Event uploaded successfully!" });
  });
});

// Fetch events
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

// Delete event
app.delete("/events/:id", (req, res) => {
  const eventId = req.params.id;

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

// Book event
app.post("/events/book/:id", async (req, res) => {
  const { id } = req.params;
  const { username } = req.body; // Ensure this is being sent by the frontend

  try {
    // Check if the event exists
    const [event] = await db.promise().query("SELECT * FROM tbl_upload WHERE id = ?", [id]);
    if (event.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    // If the event is already booked, reject the booking request
    if (event[0].status === "Booked") {
      return res.status(400).json({ message: "Event is already booked" });
    }

    // Update the event status to "Booked" and set the booked_by field
    const query = "UPDATE tbl_upload SET status = 'Booked', booked_by = ? WHERE id = ?";
    await db.promise().query(query, [username, id]);

    return res.status(200).json({ message: "Event booked successfully" });
  } catch (err) {
    console.error("Error booking event:", err);
    return res.status(500).json({ message: "Error booking the event" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});