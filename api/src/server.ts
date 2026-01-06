import 'dotenv/config'
import express from 'express'
import { z } from 'zod'
import { ChatOpenAI } from '@langchain/openai'

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 3001

app.use(express.json())

const todoSchema = z.object({
  todos: z.array(z.string().min(1)),
})

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/agent', async (req, res) => {
  const { input } = req.body ?? {}
  if (typeof input !== 'string' || input.trim().length === 0) {
    return res.status(400).json({ error: 'input must be a non-empty string' })
  }

  try {
    const model = new ChatOpenAI({
      model: 'gpt-4o-mini',
      apiKey: process.env.OPENAI_API_KEY,
    }).withStructuredOutput(todoSchema)

    const result = await model.invoke([
      {
        role: 'system',
        content:
          'You create concise TODO lists. Return a small, actionable list based on the user request.',
      },
      {
        role: 'user',
        content: `User request: ${input}`,
      },
    ])

    res.json(result)
  } catch (error) {
    console.error('Failed to generate todos', error)
    res.status(500).json({ error: 'failed to generate todos' })
  }
})

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`)
})
