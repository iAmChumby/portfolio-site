'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import ProximityCard from './ProximityCard';

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
  const [isBouncing, setIsBouncing] = useState(false);

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
    const refreshInterval = gameData?.gameStatus === 'in' ? 30000 : 300000;
    const interval = setInterval(fetchGameData, refreshInterval);
    return () => clearInterval(interval);
  }, [gameData?.gameStatus]);

  // Handle bouncing ball easter egg
  const handleBallClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 600);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="neu-surface p-6">
        <div className="flex items-center gap-4 animate-pulse">
          <div className="neu-surface-inset w-12 h-12 rounded-lg gap-2" />
          <div className="flex-1">
            <div className="h-4 bg-neu-surface-inset rounded w-32 mb-2" />
            <div className="h-3 bg-neu-surface-inset rounded w-24" />
          </div>
        </div>
      </div>
    );
  }

  // Error state or no data - hide the component
  if (error || !gameData) {
    return null;
  }

  const getStatusDotColor = () => {
    if (gameData.gameStatus === 'in') {
      if (gameData.isWinning) return 'bg-green-400';
      if (gameData.isTied) return 'bg-yellow-400';
      return 'bg-red-400';
    }
    if (gameData.gameStatus === 'post') {
      return gameData.isWinning ? 'bg-green-400' : 'bg-red-400';
    }
    return 'bg-[#F58426]'; // Knicks orange for upcoming/off-season
  };

  const getStatusText = () => {
    // Off-season / No scheduled game found
    if (gameData.gameStatus === null && !gameData.opponentName) {
      return gameData.teamRecord || '';
    }

    if (gameData.gameStatus === 'in') {
      const score = `${gameData.knicksScore} - ${gameData.opponentScore}`;
      const timeInfo = `${gameData.period} ${gameData.clock}`;
      return `${score} • ${timeInfo}`;
    }
    if (gameData.gameStatus === 'post') {
      const score = `${gameData.knicksScore} - ${gameData.opponentScore}`;
      const result = gameData.isWinning ? 'W' : 'L';
      return `${result} ${score}`;
    }
    return formatGameTime();
  };

  const getStatusTextColor = () => {
    if (gameData.gameStatus === 'in') {
      if (gameData.isWinning) return 'text-green-400';
      if (gameData.isTied) return 'text-yellow-400';
      return 'text-red-400';
    }
    if (gameData.gameStatus === 'post') {
      return gameData.isWinning ? 'text-green-400' : 'text-red-400';
    }
    return 'text-neu-text-secondary';
  };

  function formatGameTime(): string {
    if (!gameData?.gameTime) return '';
    const date = new Date(gameData.gameTime);
    const now = new Date();
    
    const isToday = date.toDateString() === now.toDateString();
    
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    
    if (isToday) return `Today ${timeStr}`;
    if (isTomorrow) return `Tomorrow ${timeStr}`;
    
    const daysUntil = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntil <= 7) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      return `${dayName} ${timeStr}`;
    }
    
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${dateStr} ${timeStr}`;
  }

  const getHeadlineText = () => {
    if (gameData.gameStatus === null && !gameData.opponentName) {
      return 'Knicks';
    }
    const prefix = gameData.isHome ? 'vs' : '@';
    return `Knicks ${prefix} ${gameData.opponentName}`;
  };

  const getMoodEmoji = () => {
    if (gameData.gameStatus === 'pre' || gameData.gameStatus === null) return '🏀';
    if (gameData.isTied) return '😬';
    if (gameData.isWinning === true) return '😊';
    if (gameData.isWinning === false) return '😢';
    return '🏀';
  };

  return (
    <Link
      href="https://www.espn.com/nba/team/_/name/ny/new-york-knicks"
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full"
    >
      <ProximityCard className="neu-surface p-6 h-full transition-all duration-300">
        <div className="flex items-center gap-4">
          {/* Status Indicator Circle */}
          <div className="neu-surface-inset w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            <div 
              className={cn(
                'w-3 h-3 rounded-full',
                getStatusDotColor(),
                gameData.gameStatus === 'in' && 'animate-pulse'
              )}
            />
          </div>

          {/* Knicks Logo - Directly on card */}
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
            <p className="font-medium text-neu-text-primary">
              {getHeadlineText()}
            </p>
            <p className={cn('text-sm', getStatusTextColor())}>
              {getStatusText()}
            </p>
          </div>
          
          {/* Mood Emoji - Clickable Easter Egg */}
          <button
            onClick={handleBallClick}
            className={cn(
              'text-2xl cursor-pointer transition-transform select-none hover:scale-110',
              isBouncing && 'animate-bounce-ball'
            )}
            aria-label="Bounce basketball"
          >
            {getMoodEmoji()}
          </button>
        </div>
      </ProximityCard>
    </Link>
  );
}
