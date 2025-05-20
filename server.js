const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static('.'));

// Endpoint to update users.json
app.put('/users.json', async (req, res) => {
    try {
        const users = req.body;
        await fs.writeFile('users.json', JSON.stringify(users, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating users.json:', error);
        res.status(500).json({ error: 'Failed to update users.json' });
    }
});

// Endpoint to get users.json
app.get('/users.json', async (req, res) => {
    try {
        const data = await fs.readFile('users.json', 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading users.json:', error);
        res.status(500).json({ error: 'Failed to read users.json' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 