import { useState } from 'react'
import './App.css'
import { createId } from './utils/id'
import type { Todo } from './types/todo'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [text, setText] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')

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

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = prompt.trim()
    if (!trimmed || isGenerating) {
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const response = await fetch('/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: trimmed }),
      })

      if (!response.ok) {
        throw new Error('failed')
      }

      const data = (await response.json()) as { todos?: string[] }
      const nextTodos = (data.todos ?? []).map((todo) => ({
        id: createId(),
        text: todo,
      }))

      if (nextTodos.length === 0) {
        setError('TODO を生成できませんでした。別の内容で試してください。')
      } else {
        setTodos(nextTodos)
      }
    } catch {
      setError('生成に失敗しました。API が起動しているか確認してください。')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <p className="app__eyebrow">Simple Todo</p>
        <h1>今日やること</h1>
        <p className="app__subtitle">追加と削除だけのシンプル版。</p>
      </header>

      <form className="todo-form agent-form" onSubmit={handleGenerate}>
        <label className="todo-form__label" htmlFor="agent-input">
          やりたいこと
        </label>
        <div className="todo-form__row">
          <input
            id="agent-input"
            className="todo-form__input"
            type="text"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="例: 週末に引っ越し準備をしたい"
            autoComplete="off"
          />
          <button className="todo-form__button" type="submit" disabled={isGenerating}>
            {isGenerating ? '生成中...' : 'TODO を生成'}
          </button>
        </div>
        {error ? <p className="agent-status">{error}</p> : null}
      </form>

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
