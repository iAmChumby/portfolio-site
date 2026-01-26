'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { getFingerprint } from '@/lib/fingerprint';
import { LikeResponse, LikesResponse } from '@/types/now';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  postId: string;
  initialCount?: number;
  initialLiked?: boolean;
}

export default function LikeButton({
  postId,
  initialCount = 0,
  initialLiked = false,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // Get fingerprint on mount
  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:28',message:'Fingerprint mount effect started',data:{postId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    try {
      const fp = getFingerprint();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:31',message:'Fingerprint generated',data:{fingerprint:fp,postId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      setFingerprint(fp);
      // Fetch initial state if fingerprint is available
      if (fp) {
        fetchLikes(fp);
      }
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:37',message:'Fingerprint generation failed',data:{error:err instanceof Error?err.message:String(err),postId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error('Failed to get fingerprint:', err);
      setError('Unable to identify browser');
    }
  }, []);

  // Fetch current like state
  const fetchLikes = useCallback(async (fp: string) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:43',message:'Fetching likes - before request',data:{postId,fingerprint:fp},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    try {
      const url = `/api/posts/${postId}/likes?fingerprint=${encodeURIComponent(fp)}`;
      const response = await fetch(url);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:47',message:'Fetch likes response received',data:{postId,status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:50',message:'Fetch likes failed - non-OK response',data:{postId,status:response.status,errorText},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        throw new Error('Failed to fetch likes');
      }

      const data: LikesResponse = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:54',message:'Fetch likes success',data:{postId,count:data.count,liked:data.liked},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setCount(data.count);
      setLiked(data.liked);
      setError(null);
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:58',message:'Fetch likes error caught',data:{postId,error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      console.error('Error fetching likes:', err);
      // Don't set error for initial fetch, just use defaults
    }
  }, [postId]);

  // Toggle like with optimistic updates
  const toggleLike = useCallback(async () => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:64',message:'Toggle like called',data:{postId,fingerprint,loading,currentLiked:liked,currentCount:count},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    if (!fingerprint || loading) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:65',message:'Toggle like early return',data:{postId,hasFingerprint:!!fingerprint,loading},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      return;
    }

    // Optimistic update
    const previousLiked = liked;
    const previousCount = count;
    const newLiked = !liked;
    const newCount = newLiked ? count + 1 : count - 1;

    setLiked(newLiked);
    setCount(newCount);
    setLoading(true);
    setError(null);

    try {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:81',message:'Toggle like - before API request',data:{postId,fingerprint},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fingerprint }),
      });
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:89',message:'Toggle like response received',data:{postId,status:response.status,statusText:response.statusText,ok:response.ok},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:92',message:'Toggle like failed - non-OK response',data:{postId,status:response.status,errorData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
        // #endregion
        throw new Error(errorData.error || 'Failed to toggle like');
      }

      const data: LikeResponse = await response.json();
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:95',message:'Toggle like success',data:{postId,liked:data.liked,count:data.count},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setLiked(data.liked);
      setCount(data.count);
      setError(null);
    } catch (err) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:99',message:'Toggle like error caught',data:{postId,error:err instanceof Error?err.message:String(err)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      // Rollback optimistic update
      setLiked(previousLiked);
      setCount(previousCount);
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
    } finally {
      setLoading(false);
    }
  }, [postId, fingerprint, liked, count, loading]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleLike();
      }
    },
    [toggleLike]
  );

  if (!fingerprint) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/328294ec-665f-4097-afcf-9ff5c7a99673',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LikeButton.tsx:119',message:'LikeButton returning null - no fingerprint',data:{postId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    // #endregion
    return null; // Don't render if fingerprint unavailable
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      <button
        onClick={toggleLike}
        onKeyDown={handleKeyDown}
        disabled={loading || !!error}
        className={cn(
          'neu-surface-inset p-2 rounded-lg transition-all duration-300',
          'flex items-center gap-2',
          'hover:scale-105 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-neu-accent-light focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          liked && 'text-neu-accent-light'
        )}
        aria-label={liked ? 'Unlike this post' : 'Like this post'}
        aria-pressed={liked}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-neu-accent-light border-t-transparent rounded-full animate-spin" />
        ) : liked ? (
          <HeartIconSolid className="w-5 h-5" />
        ) : (
          <HeartIcon className="w-5 h-5 text-neu-text-secondary" />
        )}
        <span
          className={cn(
            'text-sm font-medium transition-colors',
            liked ? 'text-neu-accent-light' : 'text-neu-text-secondary'
          )}
        >
          {count}
        </span>
      </button>
      {error && (
        <div className="text-xs text-red-400 flex items-center gap-1">
          <span>{error}</span>
          <button
            onClick={toggleLike}
            className="underline hover:text-red-300"
            aria-label="Retry"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
