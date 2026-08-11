import { Router } from 'express'

import {
  createReview,
  createReviewStreamSession,
  streamReview,
} from '../controllers/reviewController.js'

export const reviewRouter = Router()

reviewRouter.post('/', createReview)
reviewRouter.post('/stream-sessions', createReviewStreamSession)
reviewRouter.get('/stream/:sessionId', streamReview)
