'use client';

import React from 'react';
import Link from 'next/link';
import { NowPost as NowPostType } from '@/types/now';
import { formatDate } from '@/lib/utils';
import LikeButton from './LikeButton';

interface NowPostProps {
  post: NowPostType;
}

/**
 * Parses markdown-style links [text](url) and converts them to React elements
 */
function parseLinks(text: string): React.ReactNode[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  while ((match = linkRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const linkText = match[1];
    const linkUrl = match[2];
    const isInternal = linkUrl.startsWith('/');

    // Add the link
    if (isInternal) {
      parts.push(
        <Link
          key={key++}
          href={linkUrl}
          className="text-neu-accent hover:text-neu-accent-light hover:underline transition-colors"
        >
          {linkText}
        </Link>
      );
    } else {
      parts.push(
        <a
          key={key++}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neu-accent hover:text-neu-accent-light hover:underline transition-colors"
        >
          {linkText}
        </a>
      );
    }

    lastIndex = linkRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
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
        {parseLinks(post.body)}
      </p>
      <LikeButton
        postId={post.id}
        initialCount={post.likeCount}
        initialLiked={false}
      />
    </article>
  );
}
