'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface KnicksGameData {
  isPlaying: boolean;
  isWinning: boolean | null;
  isTied: boolean;
  gameStatus: 'pre' | 'in' | 'post' | null;
  knicksScore: number | null;
  opponentScore: number | null;
  opponentName: string | null;
  opponentLogo: string | null;
  gameTime: string | null;
  period: string | null;
  clock: string | null;
  isHome: boolean | null;
  gameDetail: string | null;
  teamRecord: string | null;
}

const KNICKS_LOGO = 'https://a.espncdn.com/i/teamlogos/nba/500/scoreboard/ny.png';

export default function KnicksGameIndicator() {
  const [gameData, setGameData] = useState<KnicksGameData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const response = await fetch('/api/knicks');
        if (!response.ok) {
          throw new Error('Failed to fetch game data');
        }
        const data = await response.json();
        setGameData(data);
        setError(null);
      } catch {
        setError('Unable to load game data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameData();

    // Refresh every 30 seconds while the game is live, every 5 minutes otherwise
    const getRefreshInterval = () => {
      if (gameData?.gameStatus === 'in') return 30000; // 30 seconds during live games
      return 300000; // 5 minutes otherwise
    };
    
    const interval = setInterval(fetchGameData, getRefreshInterval());
    return () => clearInterval(interval);
  }, [gameData?.gameStatus]);

  // Loading state
  if (isLoading) {
    return (
      <div className="neu-surface p-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-neu-surface-inset rounded-lg" />
          <div className="flex-1">
            <div className="h-4 bg-neu-surface-inset rounded w-32 mb-2" />
            <div className="h-3 bg-neu-surface-inset rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Error state - hide the component
  if (error || !gameData) {
    return null;
  }

  // No games scheduled (off-season) but still show team info if we have record
  if (gameData.gameStatus === null && !gameData.opponentName) {
    if (!gameData.teamRecord) return null;
    
    return (
      <Link
        href="https://www.espn.com/nba/team/_/name/ny/new-york-knicks"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div
          className={cn(
            'neu-surface p-4 transition-all duration-300',
            'hover:scale-[1.02] cursor-pointer',
            'border-l-4 border-l-[#F58426]'
          )}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src={KNICKS_LOGO}
                alt="New York Knicks"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neu-text-primary">
                New York Knicks
              </p>
              <p className="text-sm text-neu-text-secondary">
                {gameData.teamRecord}
              </p>
            </div>
            <div className="flex-shrink-0 text-2xl" role="img" aria-label="basketball">
              🏀
            </div>
          </div>
        </div>
      </Link>
    );
  }

  const getMoodEmoji = () => {
    if (gameData.gameStatus === 'pre') {
      return '🏀'; // Game hasn't started
    }
    if (gameData.isTied) {
      return '😬'; // Tied
    }
    if (gameData.isWinning === true) {
      return '😊'; // Winning
    }
    if (gameData.isWinning === false) {
      return '😢'; // Losing
    }
    return '🏀';
  };

  const getStatusColor = () => {
    if (gameData.gameStatus === 'pre') {
      return 'text-neu-text-muted';
    }
    if (gameData.gameStatus === 'in') {
      if (gameData.isTied) return 'text-yellow-400';
      if (gameData.isWinning) return 'text-green-400';
      return 'text-red-400';
    }
    // Post game
    if (gameData.isWinning) return 'text-green-400';
    return 'text-red-400';
  };

  const getBorderColor = () => {
    if (gameData.gameStatus === 'in') {
      if (gameData.isWinning) return 'border-l-green-400';
      if (gameData.isTied) return 'border-l-yellow-400';
      return 'border-l-red-400';
    }
    return 'border-l-[#F58426]'; // Knicks orange for pre/upcoming games
  };

  const formatGameTime = () => {
    if (!gameData.gameTime) return null;
    const date = new Date(gameData.gameTime);
    const now = new Date();
    
    // Check if game is today
    const isToday = date.toDateString() === now.toDateString();
    
    // Check if game is tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    if (isToday) {
      return `Today at ${timeStr}`;
    }
    
    if (isTomorrow) {
      return `Tomorrow at ${timeStr}`;
    }
    
    // Show day of week for games within the next 7 days
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return `${dayName} at ${timeStr}`;
    }
    
    // Show full date for games further out
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    return `${dateStr} at ${timeStr}`;
  };

  const getMatchupText = () => {
    if (gameData.isHome) {
      return `vs ${gameData.opponentName}`;
    }
    return `@ ${gameData.opponentName}`;
  };

  return (
    <Link
      href="https://www.espn.com/nba/team/_/name/ny/new-york-knicks"
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <div
        className={cn(
          'neu-surface p-4 transition-all duration-300',
          'hover:scale-[1.02] cursor-pointer',
          'border-l-4',
          getBorderColor()
        )}
      >
        <div className="flex items-center gap-4">
          {/* Knicks Logo */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <Image
              src={KNICKS_LOGO}
              alt="New York Knicks"
              fill
              className="object-contain"
              unoptimized
            />
          </div>

          {/* Game Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {gameData.gameStatus === 'in' && (
                <span className="flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full bg-red-500 animate-pulse"
                  />
                  <span className="text-xs font-semibold text-red-400 uppercase">
                    Live
                  </span>
                </span>
              )}
              <span className="text-sm font-medium text-neu-text-primary truncate">
                Knicks {getMatchupText()}
              </span>
            </div>

            {/* Score or Time */}
            <div className="flex items-center gap-3">
              {gameData.gameStatus === 'pre' ? (
                <span className="text-sm text-neu-text-secondary">
                  {formatGameTime()}
                </span>
              ) : (
                <>
                  <span className={cn('text-lg font-bold', getStatusColor())}>
                    {gameData.knicksScore} - {gameData.opponentScore}
                  </span>
                  {gameData.gameStatus === 'in' && (
                    <span className="text-xs text-neu-text-muted">
                      {gameData.period} • {gameData.clock}
                    </span>
                  )}
                  {gameData.gameStatus === 'post' && (
                    <span className="text-xs text-neu-text-muted">Final</span>
                  )}
                </>
              )}
            </div>

            {/* Team record */}
            {gameData.teamRecord && gameData.gameStatus === 'pre' && (
              <p className="text-xs text-neu-text-muted mt-1">
                Record: {gameData.teamRecord}
              </p>
            )}
          </div>

          {/* Mood Indicator */}
          <div className="flex-shrink-0 text-3xl" role="img" aria-label={
            gameData.gameStatus === 'pre' ? 'basketball' :
            gameData.isWinning ? 'happy' : 
            gameData.isTied ? 'nervous' : 'sad'
          }>
            {getMoodEmoji()}
          </div>

          {/* Opponent Logo */}
          {gameData.opponentLogo && (
            <div className="relative w-10 h-10 flex-shrink-0 opacity-60">
              <Image
                src={gameData.opponentLogo}
                alt={gameData.opponentName || 'Opponent'}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
