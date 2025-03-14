const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'ecommerce'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to database');
});

app.use(express.static('public'));
app.use(bodyParser.json());

// Fetch products
app.get('/api/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Signup route
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ? OR name = ?', [email, name], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }
        
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err) => {
            if (err) throw err;
            res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

// Login route
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(401).json({ message: 'User not registered. Please sign up first.' });
        }
        
        if (results[0].password !== password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        
        res.status(200).json({ message: 'Login successful' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});