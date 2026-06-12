import { useState, useEffect } from 'react'
import Board from './components/Board'

function App() {
  const [boards, setBoards] = useState([])
  const [newBoardName, setNewBoardName] = useState('')
  const [selectedBoard, setSelectedBoard] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3001/api/boards')
      .then(res => res.json())
      .then(data => setBoards(data))
  }, [])

  function createBoard() {
    if (!newBoardName.trim()) return
    fetch('http://localhost:3001/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newBoardName })
    })
      .then(res => res.json())
      .then(board => {
        setBoards([...boards, board])
        setNewBoardName('')
      })
  }

  if (selectedBoard) {
    return <Board board={selectedBoard} onBack={() => setSelectedBoard(null)} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Boards</h1>
      
      <div className="flex gap-2 mb-8">
        <input
          className="border rounded px-3 py-2 w-64"
          placeholder="New board name..."
          value={newBoardName}
          onChange={e => setNewBoardName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createBoard()}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={createBoard}
        >
          Create Board
        </button>
      </div>

      <div className="flex flex-wrap gap-4">
        {boards.map(board => (
          <div
            key={board.id}
            className="bg-white rounded-lg shadow p-4 w-48 cursor-pointer hover:shadow-md"
            onClick={() => setSelectedBoard(board)}
          >
            <h2 className="font-semibold text-gray-700">{board.name}</h2>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App