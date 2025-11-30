import Bottleneck from 'bottleneck';
import dotenv from 'dotenv';

dotenv.config();

const minTime = parseInt(process.env.THROTTLE_MIN_TIME || '1100', 10);

const limiter = new Bottleneck({
  minTime: minTime,
  maxConcurrent: 1, // Ensure sequential execution
});

export const queueService = {
  schedule: limiter.schedule.bind(limiter),
  limiter,
};
