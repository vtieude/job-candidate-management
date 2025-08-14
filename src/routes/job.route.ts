import { Router } from 'express';
import * as jobService from '../services/job.service'
import { IJob } from '../schema/job.schema';
import { ModifiedPathsSnapshot, Document, Model, Types, ClientSession, DocumentSetOptions, QueryOptions, MergeType, UpdateQuery, AnyObject, PopulateOptions, Query, SaveOptions, ToObjectOptions, UpdateWithAggregationPipeline, pathsToSkip, Error } from 'mongoose';

const jobRoute = Router();

jobRoute.get('', async (req, res) => {
  const listJob = await jobService.listJob();
  res.status(200).json({ jobs:  listJob });
});

jobRoute.get('/:id', async (req, res) => {
  const { id } = req.params;
  const listJob = await jobService.getJobById(id);
  res.status(200).json({ job:  listJob });
});


jobRoute.post('', async (req, res) => {
  const newJob: IJob = {
    title: 'testjob',
    company: 'testcompany',
    location: 'testcompany',
  };
  await jobService.createJob(newJob);
  res.status(200).json({ jobs:  newJob });
});

export default jobRoute;