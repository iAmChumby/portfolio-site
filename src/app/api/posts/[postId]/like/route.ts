import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, LikeKeys } from '@/lib/redis';
import { LikeResponse } from '@/types/now';

const RATE_LIMIT_LIKES = 10; // Max likes per hour
const RATE_LIMIT_WINDOW = 3600; // 1 hour in seconds

/**
 * Check rate limit for fingerprint
 */
async function checkRateLimit(
  redis: ReturnType<typeof getRedisClient>,
  fingerprint: string
): Promise<boolean> {
  const rateLimitKey = LikeKeys.rateLimit(fingerprint);
  const currentCount = await redis.get<number>(rateLimitKey);

  if (currentCount !== null && currentCount >= RATE_LIMIT_LIKES) {
    return false; // Rate limit exceeded
  }

  // Increment rate limit counter
  if (currentCount === null) {
    // First request in window
    await redis.set(rateLimitKey, 1, { ex: RATE_LIMIT_WINDOW });
  } else {
    await redis.incr(rateLimitKey);
  }

  return true; // Within rate limit
}

/**
 * POST /api/posts/[postId]/like
 * Toggle like status for a post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  // #region agent log
  const logPath = 'c:\\Users\\73spi\\Projects\\portfolio-site\\.cursor\\debug.log';
  const logEntry = JSON.stringify({location:'route.ts:37',message:'POST /like route called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C,D'})+'\n';
  await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry).catch(()=>{}));
  // #endregion
  try {
    const { postId } = await params;
    // #region agent log
    const logEntry2 = JSON.stringify({location:'route.ts:42',message:'Post ID extracted',data:{postId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n';
    await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry2).catch(()=>{}));
    // #endregion
    const body = await request.json();
    const { fingerprint } = body;
    // #region agent log
    const logEntry3 = JSON.stringify({location:'route.ts:44',message:'Request body parsed',data:{postId,fingerprint:fingerprint?.substring(0,10)+'...'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})+'\n';
    await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry3).catch(()=>{}));
    // #endregion

    // Validate inputs
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    if (!fingerprint || typeof fingerprint !== 'string') {
      return NextResponse.json(
        { error: 'Fingerprint is required' },
        { status: 400 }
      );
    }

    // Sanitize fingerprint (basic validation - base36 hash)
    if (fingerprint.length > 50 || !/^[a-z0-9]+$/i.test(fingerprint)) {
      return NextResponse.json(
        { error: 'Invalid fingerprint format' },
        { status: 400 }
      );
    }

    const redis = getRedisClient();
    const likesKey = LikeKeys.postLikes(postId);
    const countKey = LikeKeys.postLikeCount(postId);

    // Check rate limit
    const withinRateLimit = await checkRateLimit(redis, fingerprint);
    if (!withinRateLimit) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // Check if user has already liked
    const isMember = (await redis.sismember(likesKey, fingerprint)) === 1;

    let liked: boolean;
    let count: number;

    if (isMember) {
      // Unlike: remove from set
      await redis.srem(likesKey, fingerprint);
      liked = false;

      // Get current count and decrement
      const currentCount = await redis.get<number>(countKey);
      if (currentCount !== null && currentCount > 0) {
        count = currentCount - 1;
      } else {
        // Fallback: calculate from set size
        count = await redis.scard(likesKey);
      }
    } else {
      // Like: add to set
      await redis.sadd(likesKey, fingerprint);
      liked = true;

      // Get current count and increment
      const currentCount = await redis.get<number>(countKey);
      if (currentCount !== null) {
        count = currentCount + 1;
      } else {
        // Fallback: calculate from set size
        count = await redis.scard(likesKey);
      }
    }

    // Update cached count
    await redis.set(countKey, count, { ex: 3600 }); // Cache for 1 hour

    const response: LikeResponse = {
      liked,
      count,
    };

    return NextResponse.json(response);
  } catch (error) {
    // #region agent log
    const logPath = 'c:\\Users\\73spi\\Projects\\portfolio-site\\.cursor\\debug.log';
    const logEntry6 = JSON.stringify({location:'route.ts:125',message:'Error caught in POST /like',data:{error:error instanceof Error?error.message:String(error),stack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})+'\n';
    await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry6).catch(()=>{}));
    // #endregion
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
