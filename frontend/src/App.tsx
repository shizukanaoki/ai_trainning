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

  const hasTodos = todos.length > 0

  return (
    <div className="app">
      <div className="app__glow app__glow--primary" />
      <div className="app__glow app__glow--secondary" />

      <header className="app__header">
        <div className="app__badge">NEO TODO SYSTEM</div>
        <div className="app__title-group">
          <h1>未来のタスクダッシュボード</h1>
          <p className="app__subtitle">
            AI と人の手でミニマルに管理。今日の集中ポイントを洗練された UI で。
          </p>
        </div>
        <div className="app__chips">
          <span className="app__chip">Live sync</span>
          <span className="app__chip app__chip--muted">{todos.length} 件の TODO</span>
        </div>
      </header>

      <div className="app__grid">
        <form className="panel panel--accent" onSubmit={handleGenerate}>
          <div className="panel__header">
            <p className="panel__label">AI Assist</p>
            <h2>アイデアから TODO を生成</h2>
            <p className="panel__description">
              やりたいことを一文で入力すると、実行可能なタスクに分解します。
            </p>
          </div>
          <div className="panel__fields">
            <input
              id="agent-input"
              className="input"
              type="text"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="例: 週末に引っ越し準備を完了したい"
              autoComplete="off"
            />
            <button className="button button--primary" type="submit" disabled={isGenerating}>
              {isGenerating ? '生成中...' : 'TODO を生成'}
            </button>
          </div>
          {error ? <p className="panel__status">{error}</p> : null}
        </form>

        <form className="panel" onSubmit={handleSubmit}>
          <div className="panel__header">
            <p className="panel__label">Manual</p>
            <h2>自分で TODO を追加</h2>
            <p className="panel__description">手早く一件ずつ登録できます。</p>
          </div>
          <div className="panel__fields">
            <input
              id="todo-input"
              className="input"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="例: 牛乳を買う"
              autoComplete="off"
            />
            <button className="button" type="submit">
              追加
            </button>
          </div>
        </form>
      </div>

      <section className="panel panel--list">
        <div className="panel__header panel__header--row">
          <div>
            <p className="panel__label">Live board</p>
            <h2>TODO リスト</h2>
            <p className="panel__description">削除すると即座に反映されます。</p>
          </div>
          <div className="counter">
            <span className="counter__value">{todos.length}</span>
            <span className="counter__label">items</span>
          </div>
        </div>

        {hasTodos ? (
          <ul className="todo-list">
            {todos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <div className="todo-item__content">
                  <span className="todo-item__text">{todo.text}</span>
                  <span className="todo-item__meta">手動 &amp; AI 生成に対応</span>
                </div>
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
        ) : (
          <div className="todo-empty">
            <p>TODO はまだありません</p>
            <span>上のフォームから作成すると、ここに未来的なリストが並びます。</span>
          </div>
        )}
      </section>
    </div>
  )
}

export default App
