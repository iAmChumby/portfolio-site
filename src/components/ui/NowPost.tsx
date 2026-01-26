'use client';

import React from 'react';
import { NowPost as NowPostType } from '@/types/now';
import { formatDate } from '@/lib/utils';
import LikeButton from './LikeButton';

interface NowPostProps {
  post: NowPostType;
}

export default function NowPost({ post }: NowPostProps) {
  return (
    <article className="neu-surface-inset p-4 rounded-lg transition-all duration-300 hover:scale-[1.01]">
      <time className="text-xs text-neu-text-muted block mb-2">
        {formatDate(post.date)}
      </time>
      <h4 className="text-base font-semibold text-neu-text-primary mb-2">
        {post.title}
      </h4>
      <p className="text-sm text-neu-text-secondary leading-relaxed">
        {post.body}
      </p>
      <LikeButton
        postId={post.id}
        initialCount={post.likeCount}
        initialLiked={false}
      />
    </article>
  );
}
