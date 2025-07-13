import rateLimit from '../config/upstash.js';

const rateLimiter = async (request, result, next) => {
  try {
    const limiterkey = 'rate-limit';
    // Here we just kept the key simple
    // In the real world app we should use user ip addres or user id as the limiter key
    const success = await rateLimit.limit(limiterkey);

    if (!success) {
      return result.status(429).json({
        message: 'Too many requests, please try again later.',
      });
    }

    next();
  } catch (error) {
    console.log('Rate limit error', error);
    next(error);
  }
};

export default rateLimiter;
