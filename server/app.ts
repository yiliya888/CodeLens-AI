import cors from 'cors'
import express from 'express'

import { errorMiddleware } from './middleware/errorMiddleware.js'
import { reviewRouter } from './routes/reviewRoutes.js'

export const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:5173',
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use('/api/review', reviewRouter)

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' })
})

app.use(errorMiddleware)
