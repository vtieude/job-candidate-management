import { Router } from 'express';

const jobRoute = Router();

jobRoute.get('', async (req, res) => {
  res.status(200).json({ message: 'API working' });
});

export default jobRoute;