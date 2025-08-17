import mongoose from 'mongoose';
import { Job } from '../schema/job.schema';
import { Candidate } from '../schema/candidate.schema';
import { User } from '../schema/user.schema';

async function seed() {
  await mongoose.connect('mongodb://localhost:27017/mydb'); // Replace with your url
  console.log('MongoDB connected');

  // Create Jobs
  const jobs = await Job.insertMany([
    { title: 'Backend Developer', company: 'ABC Corp', location: 'VNN', description: 'Work on Node.js APIs', salaryMax: 50, salaryMin: 10 },
    { title: 'Frontend Developer', company: 'XYZ Ltd', location: 'DNE', description: 'React.js and UI', salaryMax: 20, salaryMin: 10 },
  ]);

  // Create Candidates
  const candidates = await Candidate.insertMany([
    { fullName: 'Alice', email: 'alice@example.com', status: 'active' },
    { fullName: 'Bob', email: 'bob@example.com', status: 'inactive' },
    { fullName: 'Charlie', email: 'charlie@example.com', status: 'active' },
  ]);

  // Create JobCandidate references
  await User.insertMany([
    {email: 'user1@gmai.com', password: '123456'}, 
  ]);

  console.log('Seed finished');
  await mongoose.disconnect();
}

seed().catch(err => console.error(err));
