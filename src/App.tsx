import { useRef, useState } from 'react'
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
  const inputRef = useRef<HTMLInputElement | null>(null)

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

  const handleFocus = () => {
    inputRef.current?.focus()
  }

  return (
    <div className="app">
      <div className="hero">
        <p className="app__eyebrow">Tiny Todo</p>
        <header className="app__header">
          <h1>毎日のタスクを、軽やかに。</h1>
          <p className="app__subtitle">
            頭に浮かんだ瞬間を書き留めて、やるべきことをクリアに保つための小さな相棒。
          </p>
          <div className="hero__cta">
            <button type="button" className="hero__button" onClick={handleFocus}>
              今すぐタスクを追加
            </button>
            <span className="hero__support">書き出したら、そのまま完了まで一直線。</span>
          </div>
        </header>
      </div>

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
            ref={inputRef}
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
