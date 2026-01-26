import { Redis } from '@upstash/redis';

/**
 * Redis client singleton for Upstash Redis
 * Uses REST API for serverless compatibility
 */
let redisClient: Redis | null = null;

/**
 * Get or create Redis client instance
 */
export function getRedisClient(): Redis {
  // #region agent log
  const logPath = 'c:\\Users\\73spi\\Projects\\portfolio-site\\.cursor\\debug.log';
  const logEntry = JSON.stringify({location:'redis.ts:12',message:'getRedisClient called',data:{hasExistingClient:!!redisClient},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n';
  import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry).catch(()=>{}));
  // #endregion
  if (redisClient) {
    return redisClient;
  }

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  // #region agent log
  const logEntry2 = JSON.stringify({location:'redis.ts:18',message:'Redis env vars checked',data:{hasUrl:!!url,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n';
  import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry2).catch(()=>{}));
  // #endregion

  if (!url || !token) {
    // #region agent log
    const logEntry3 = JSON.stringify({location:'redis.ts:21',message:'Redis config missing',data:{hasUrl:!!url,hasToken:!!token},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n';
    import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry3).catch(()=>{}));
    // #endregion
    throw new Error(
      'Missing Redis configuration. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.'
    );
  }

  redisClient = new Redis({
    url,
    token,
  });
  // #region agent log
  const logEntry4 = JSON.stringify({location:'redis.ts:29',message:'Redis client created',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n';
  import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry4).catch(()=>{}));
  // #endregion

  return redisClient;
}

/**
 * Redis key helpers for like functionality
 */
export const LikeKeys = {
  /**
   * Get Redis key for post likes set
   */
  postLikes: (postId: string) => `post:likes:${postId}`,

  /**
   * Get Redis key for cached like count
   */
  postLikeCount: (postId: string) => `post:like_count:${postId}`,

  /**
   * Get Redis key for rate limiting
   */
  rateLimit: (fingerprint: string) => `like:rate_limit:${fingerprint}`,
};
