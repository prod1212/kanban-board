import { useState, useEffect } from 'react'

function Column({ column }) {
  const [cards, setCards] = useState([])
  const [newCardTitle, setNewCardTitle] = useState('')
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    fetch(`http://localhost:3001/api/columns/${column.id}/cards`)
      .then(res => res.json())
      .then(data => setCards(data))
  }, [column.id])

  function createCard() {
    if (!newCardTitle.trim()) return
    fetch(`http://localhost:3001/api/columns/${column.id}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newCardTitle, description: '', position: cards.length })
    })
      .then(res => res.json())
      .then(card => {
        setCards([...cards, card])
        setNewCardTitle('')
        setAdding(false)
      })
  }

  return (
    <div className="bg-gray-200 rounded-lg p-4 w-64 flex flex-col gap-2">
      <h2 className="font-semibold text-gray-700 mb-2">{column.name}</h2>

      {cards.map(card => (
        <div key={card.id} className="bg-white rounded shadow p-3 cursor-pointer hover:shadow-md">
          <p className="text-sm text-gray-800">{card.title}</p>
        </div>
      ))}

      {adding ? (
        <div className="flex flex-col gap-2 mt-2">
          <input
            className="border rounded px-2 py-1 text-sm w-full"
            placeholder="Card title..."
            value={newCardTitle}
            onChange={e => setNewCardTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') createCard()
              if (e.key === 'Escape') setAdding(false)
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              onClick={createCard}
            >
              Add
            </button>
            <button
              className="text-gray-500 text-sm hover:text-gray-800"
              onClick={() => setAdding(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="text-gray-500 text-sm hover:text-gray-800 text-left mt-2"
          onClick={() => setAdding(true)}
        >
          + Add a card
        </button>
      )}
    </div>
  )
}

export default Column