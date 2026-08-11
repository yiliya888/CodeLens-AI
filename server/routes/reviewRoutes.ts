import { Router } from 'express'

import { createReview } from '../controllers/reviewController.js'

export const reviewRouter = Router()

reviewRouter.post('/', createReview)
