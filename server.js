const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'itb03',
});

async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                age INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        connection.release();
        console.log('Tabla users a fost creată sau deja există.');
    } catch (error) {
        console.error('Eroare la inițializarea bazei de date:', error);
    }
}

//app.unsubscribe(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function renderPage(res, page, options = {}) {
    res.sendFile(path.join(__dirname, 'public', page));
}

app.get('/', (req, res) => {
    renderPage(res, 'index.html');
});
app.get('/about', (req, res) => {
    renderPage(res, 'about.html');
});
app.get('/product', (req, res) => {
    renderPage(res, 'product.html');
});
app.get('/contact', (req, res) => {
    renderPage(res, 'contact.html');
});
app.get('/register', (req, res) => {
    renderPage(res, 'register.html');
});

app.post('/register', async (req, res) => {
    const { username, email, password, age } = req.body;

    if (!username || !email || !password || !age) {
        return res.status(400).send('Toate câmpurile sunt obligatorii.');
    }

    try {
        const connection = await pool.getConnection();
        try {
            await connection.query(
                'INSERT INTO users (username, email, password, age) VALUES (?, ?, ?, ?)',
                [username, email, password, age]
            );
            connection.release();
                res.redirect('/register-success.html');
        } catch (error) {
            connection.release();
            console.error('Eroare la înregistrarea utilizatorului:', error);
            res.status(500).send('Eroare internă a serverului.');
        }
    } catch (error) {
        console.error('Eroare la obținerea conexiunii:', error);
        res.status(500).send('Eroare internă a serverului.');
    }
});
app.use(express.static('public'));

app.listen(PORT, async () => {
    await initializeDatabase();
    console.log('Server is running on port ' + `http://localhost:${PORT}`);
})