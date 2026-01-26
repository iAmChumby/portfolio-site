import { NextRequest, NextResponse } from 'next/server';
import { getRedisClient, LikeKeys } from '@/lib/redis';
import { LikesResponse } from '@/types/now';

/**
 * GET /api/posts/[postId]/likes
 * Get like count and check if user has liked the post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  // #region agent log
  const logPath = 'c:\\Users\\73spi\\Projects\\portfolio-site\\.cursor\\debug.log';
  const logEntry = JSON.stringify({location:'likes/route.ts:9',message:'GET /likes route called',data:{timestamp:Date.now()},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C,D'})+'\n';
  await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry).catch(()=>{}));
  // #endregion
  try {
    const { postId } = await params;
    const fingerprint = request.nextUrl.searchParams.get('fingerprint');
    // #region agent log
    const logEntry2 = JSON.stringify({location:'likes/route.ts:15',message:'GET /likes params extracted',data:{postId,fingerprint:fingerprint?.substring(0,10)+'...'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})+'\n';
    await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry2).catch(()=>{}));
    // #endregion

    // Validate postId
    if (!postId || typeof postId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid post ID' },
        { status: 400 }
      );
    }

    const redis = getRedisClient();
    const likesKey = LikeKeys.postLikes(postId);
    const countKey = LikeKeys.postLikeCount(postId);

    // Try to get cached count first
    let count: number;
    const cachedCount = await redis.get<number>(countKey);

    if (cachedCount !== null && typeof cachedCount === 'number') {
      count = cachedCount;
    } else {
      // Calculate count from set size
      count = await redis.scard(likesKey);
      // Cache the count
      await redis.set(countKey, count, { ex: 3600 }); // Cache for 1 hour
    }

    // Check if user has liked (if fingerprint provided)
    let liked = false;
    if (fingerprint && typeof fingerprint === 'string') {
      liked = (await redis.sismember(likesKey, fingerprint)) === 1;
    }

    const response: LikesResponse = {
      count,
      liked,
    };

    return NextResponse.json(response);
  } catch (error) {
    // #region agent log
    const logPath = 'c:\\Users\\73spi\\Projects\\portfolio-site\\.cursor\\debug.log';
    const logEntry5 = JSON.stringify({location:'likes/route.ts:54',message:'Error caught in GET /likes',data:{error:error instanceof Error?error.message:String(error),stack:error instanceof Error?error.stack:undefined},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,C'})+'\n';
    await import('fs').then(fs=>fs.promises.appendFile(logPath,logEntry5).catch(()=>{}));
    // #endregion
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}
