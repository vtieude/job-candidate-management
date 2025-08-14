import { Router } from 'express';
import candidateRoute from './candidate.route';
import jobRoute from './job.route';
const route = Router();

route.use('/candidate', candidateRoute);
route.use('/job', jobRoute);

export default route;