import { Router } from 'express';
import candidateRoute from './candidate';
import jobRoute from './job';
const route = Router();

route.use('/candidate', candidateRoute);
route.use('/job', jobRoute);

export default route;