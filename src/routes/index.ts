import { Router } from 'express';
import candidateRoute from './candidate.route';
import jobRoute from './job.route';
import userRoute from './user.route';
const route = Router();

route.use('/candidate', candidateRoute);
route.use('/job', jobRoute);
route.use('/user', userRoute);

export default route;