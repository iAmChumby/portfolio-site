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
  if (redisClient) {
    return redisClient;
  }

  const url = process.env.LUKE_KV_KV_REST_API_URL || process.env.KV_REST_API_URL;
  const token = process.env.LUKE_KV_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    throw new Error(
      'Missing Redis configuration. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.'
    );
  }

  redisClient = new Redis({
    url,
    token,
  });

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

/**
 * Redis key helpers for contact form functionality
 */
export const ContactKeys = {
  /**
   * Get Redis key for contact form rate limiting
   * @param ip - Client IP address
   */
  contactRateLimit: (ip: string) => `contact:rate_limit:${ip}`,
};
