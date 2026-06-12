import express from 'express'
import cors from 'cors'
import Database from 'better-sqlite3'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

const db = new Database('kanban.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS columns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    position INTEGER NOT NULL,
    FOREIGN KEY (board_id) REFERENCES boards(id)
  )
`)

db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    column_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL,
    FOREIGN KEY (column_id) REFERENCES columns(id)
  )
`)

app.get('/api/boards', (req, res) => {
  const boards = db.prepare('SELECT * FROM boards').all()
  res.json(boards)
})

app.post('/api/boards', (req, res) => {
  const { name } = req.body
  const result = db.prepare('INSERT INTO boards (name) VALUES (?)').run(name)
  res.json({ id: result.lastInsertRowid, name })
})

app.delete('/api/boards/:id', (req, res) => {
  db.prepare('DELETE FROM boards WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// Column routes
app.get('/api/boards/:id/columns', (req, res) => {
  const columns = db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').all(req.params.id)
  res.json(columns)
})

app.post('/api/boards/:id/columns', (req, res) => {
  const { name, position } = req.body
  const result = db.prepare('INSERT INTO columns (board_id, name, position) VALUES (?, ?, ?)').run(req.params.id, name, position)
  res.json({ id: result.lastInsertRowid, board_id: req.params.id, name, position })
})

app.delete('/api/columns/:id', (req, res) => {
  db.prepare('DELETE FROM columns WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

// Card routes
app.get('/api/columns/:id/cards', (req, res) => {
  const cards = db.prepare('SELECT * FROM cards WHERE column_id = ? ORDER BY position').all(req.params.id)
  res.json(cards)
})

app.post('/api/columns/:id/cards', (req, res) => {
  const { title, description, position } = req.body
  const result = db.prepare('INSERT INTO cards (column_id, title, description, position) VALUES (?, ?, ?, ?)').run(req.params.id, title, description, position)
  res.json({ id: result.lastInsertRowid, column_id: req.params.id, title, description, position })
})

app.patch('/api/cards/:id', (req, res) => {
  const { title, description, position, column_id } = req.body
  db.prepare('UPDATE cards SET title = ?, description = ?, position = ?, column_id = ? WHERE id = ?').run(title, description, position, column_id, req.params.id)
  res.json({ success: true })
})

app.delete('/api/cards/:id', (req, res) => {
  db.prepare('DELETE FROM cards WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})