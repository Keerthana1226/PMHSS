const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors()); // Enable CORS for all routes


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

app.post('/signup', (req, res) => {
    console.log('Signup request received:', req.body);
    const { name, email, password, dob, mobileNumber, mentalHealthStatus } = req.body;
  
    db.query(
      `INSERT INTO Users (Name, EmailID, Password, MobileNumber, DOB, MentalHealthStatus) VALUES (?, ?, ?, ?, ?, ?)`,
      [name, email, password, mobileNumber, dob, mentalHealthStatus],
      (err, results) => {
        if (err) {
          console.error('Error inserting data:', err);  // Log the error for debugging
          res.status(500).send('Error signing up');
        } else {
          res.status(200).send('User signed up successfully');
        }
      }
    );
  });
  

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Check for matching credentials in the database
  db.query(
    `SELECT * FROM Users WHERE EmailID = ? AND Password = ?`,
    [email, password],
    (err, results) => {
      if (err) {
        console.error('Error checking credentials:', err);
        res.status(500).send('Error logging in');
      } else if (results.length > 0) {
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
