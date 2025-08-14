import { Router } from 'express';

const candidateRoute = Router();

candidateRoute.get('', async (req, res) => {
  res.status(200).json({ message: 'API working' });
});

export default candidateRoute;