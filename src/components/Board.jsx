import { useState, useEffect } from 'react'
import Column from './Column'

function Board({ board, onBack }) {
  const [columns, setColumns] = useState([])
  const [newColumnName, setNewColumnName] = useState('')

  useEffect(() => {
    fetch(`http://localhost:3001/api/boards/${board.id}/columns`)
      .then(res => res.json())
      .then(data => setColumns(data))
  }, [board.id])

  function createColumn() {
    if (!newColumnName.trim()) return
    fetch(`http://localhost:3001/api/boards/${board.id}/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newColumnName, position: columns.length })
    })
      .then(res => res.json())
      .then(column => {
        setColumns([...columns, { ...column, cards: [] }])
        setNewColumnName('')
      })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex items-center gap-4 mb-6">
        <button
          className="text-gray-500 hover:text-gray-800"
          onClick={onBack}
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">{board.name}</h1>
      </div>

      <div className="flex gap-2 mb-8">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="New column name..."
          value={newColumnName}
          onChange={e => setNewColumnName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createColumn()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={createColumn}
        >
          Add Column
        </button>
      </div>

      <div className="flex gap-4 items-start">
        {columns.map(column => (
            <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  )
}

export default Board