import app from './app.js';
import dotenv from 'dotenv';
import { startNotifyJob } from './jobs/notifyJob.js';
dotenv.config();
const PORT = process.env.PORT || 5000;

startNotifyJob(); // start cron

app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
