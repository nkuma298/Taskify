const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: '', // Replace with your MySQL password
  database: 'taskify'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
});

// API Routes

// Create Task
app.post('/tasks', (req, res) => {
  const { title, description, due_date, priority, status } = req.body;
  const query = 'INSERT INTO tasks (title, description, due_date, priority, status) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [title, description, due_date, priority, status], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating task' });
    }
    res.status(201).json({ id: result.insertId, title, description, due_date, priority, status });
  });
});

// Get All Tasks
app.get('/tasks', (req, res) => {
  const { status, priority } = req.query;
  let query = 'SELECT * FROM tasks';
  const params = [];

  if (status) {
    query += ' WHERE status = ?';
    params.push(status);
  }

  if (priority) {
    query += status ? ' AND priority = ?' : ' WHERE priority = ?';
    params.push(priority);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching tasks' });
    }
    res.json(results);
  });
});

// Get Task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const query = 'SELECT * FROM tasks WHERE id = ?';
  db.query(query, [taskId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching task' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(results[0]);
  });
});

// Update Task
app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const { title, description, due_date, priority, status } = req.body;
  const query = 'UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ? WHERE id = ?';
  db.query(query, [title, description, due_date, priority, status, taskId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating task' });
    }
    res.json({ id: taskId, title, description, due_date, priority, status });
  });
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const query = 'DELETE FROM tasks WHERE id = ?';
  db.query(query, [taskId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting task' });
    }
    res.status(204).send();
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
