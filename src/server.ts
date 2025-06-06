import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { HTTPException } from 'hono/http-exception'
import { Fragment } from 'hono/jsx'
import { serveStatic } from '@hono/node-server/serve-static'
import { Layout } from './client/layout.js'
import { detectLanguages } from './language-detection.js'
import { DetectionOptions } from './types.js'

const app = new Hono()

// Enable CORS for all routes
app.use('*', cors({
  origin: ['http://localhost:8787', 'http://127.0.0.1:8787'],
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}) as any)

// Serve static files
app.use('/static/*', serveStatic({
  root: './dist/static',
  rewriteRequestPath: (path) => path.replace(/^\/static/, ''),
}))

// Error handling middleware
app.onError((err, c) => {
  console.error('Server error:', err)
  
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status)
  }
  
  return c.json({ error: 'Internal Server Error' }, 500)
})

app.get('/', (c) => {
  return c.html(Fragment({ children: Layout({}) }))
})

app.get('/guess', async (c) => {
  const query = c.req.query()
  const { text, ...options } = query

  if (!text) {
    throw new HTTPException(400, {
      message: 'Missing required parameter: text'
    })
  }

  try {
    const detectionOptions: Partial<DetectionOptions> = {
      fineTune: options.fineTune === 'true',
      verbose: options.verbose === 'true',
      expectedRelativeConfidence: options.expectedRelativeConfidence ? 
        parseFloat(options.expectedRelativeConfidence) : undefined
    }

    const result = await detectLanguages(text, detectionOptions)
    return c.json(result)
  } catch (error) {
    console.error('Language detection error:', error)
    throw new HTTPException(500, {
      message: 'Internal server error during language detection'
    })
  }
})

app.post('/guess', async (c) => {
  try {
    const body = await c.req.json()
    const { text, ...options } = body

    if (!text) {
      throw new HTTPException(400, {
        message: 'Missing required parameter: text'
      })
    }

    const result = await detectLanguages(text, options)
    return c.json(result)
  } catch (error) {
    if (error instanceof HTTPException) {
      throw error
    }
    
    console.error('Language detection error:', error)
    throw new HTTPException(500, {
      message: 'Internal server error during language detection'
    })
  }
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  })
})

const port = parseInt(process.env.PORT || '8787')

console.log(`Starting server on port ${port}`)

serve({
  fetch: app.fetch,
  port
})

console.log(`Server is running on http://localhost:${port}`)
