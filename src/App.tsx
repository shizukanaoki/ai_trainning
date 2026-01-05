import { useState } from 'react'
import './App.css'

type Todo = {
  id: string
  text: string
}

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) {
      return
    }

    setTodos((prev) => [...prev, { id: createId(), text: trimmed }])
    setText('')
  }

  const handleDelete = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Tiny Todo</p>
        <h1>今日やること</h1>
        <p className="app__subtitle">追加と削除だけのシンプル版。</p>
      </header>

      <form className="todo-form" onSubmit={handleSubmit}>
        <label className="todo-form__label" htmlFor="todo-input">
          TODO
        </label>
        <div className="todo-form__row">
          <input
            id="todo-input"
            className="todo-form__input"
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="例: 牛乳を買う"
            autoComplete="off"
          />
          <button className="todo-form__button" type="submit">
            追加
          </button>
        </div>
      </form>

      {todos.length === 0 ? (
        <div className="todo-empty">
          <p>まだTODOはありません。</p>
          <span>上のフォームから追加してください。</span>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className="todo-item">
              <span className="todo-item__text">{todo.text}</span>
              <button
                className="todo-item__delete"
                type="button"
                onClick={() => handleDelete(todo.id)}
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App
