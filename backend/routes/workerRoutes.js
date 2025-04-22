// backend/routes/workerRoutes.js
import express from 'express';
import { isWorker } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/worker-dashboard', isWorker, (req, res) => {
  res.send('Welcome to the Worker Dashboard');
});

export default router;
