'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SiSpotify, SiApplemusic } from 'react-icons/si';
import WeatherCard from '@/components/ui/WeatherCard';
import KnicksGameIndicator from '@/components/ui/KnicksGameIndicator';
import NowPost from '@/components/ui/NowPost';
import { LOCATIONS } from '@/lib/weather';
import { NowData } from '@/types/now';
import nowData from '@/data/now.json';
import { cn } from '@/lib/utils';

const data = nowData as NowData;

export default function Now() {
  const statusColors = {
    open: 'text-neu-accent-light',
    busy: 'text-yellow-400',
    unavailable: 'text-red-400',
  };

  const statusDotColors = {
    open: 'bg-neu-accent-light',
    busy: 'bg-yellow-400',
    unavailable: 'bg-red-400',
  };

  return (
    <section id="now" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header - matching Contact/Projects pattern */}
          <div className="text-center mb-16">
            <div className="relative inline-block neu-surface p-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-4">
                <span className="neu-text-gradient">What I&apos;m Doing Now</span>
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-center max-w-2xl mx-auto text-neu-text-secondary">
                A snapshot of what&apos;s currently on my radar
              </p>
            </div>
          </div>

          {/* Two-column layout: Posts left, Status right */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
            {/* Left Column - Posts */}
            <div className="order-2 lg:order-1 space-y-8">
              <div className="neu-surface p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">
                  Recent Updates
                </h3>
                <div className="space-y-4">
                  {data.posts.map((post) => (
                    <NowPost key={post.id} post={post} />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Asymmetric Grid */}
            <div className="order-1 lg:order-2 space-y-8">
              {/* Availability Card */}
              <div className="neu-surface p-6">
                <div className="flex items-center gap-4">
                  <div className="neu-surface-inset w-12 h-12 rounded-lg flex items-center justify-center">
                    <div className={`w-3 h-3 rounded-full ${statusDotColors[data.availability.status]} animate-pulse`}></div>
                  </div>
                  <div>
                    <p className="font-medium text-neu-text-primary">Status</p>
                    <p className={`text-sm ${statusColors[data.availability.status]}`}>
                      {data.availability.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Knicks Game Indicator */}
              <KnicksGameIndicator />

              {/* Weather Cards */}
              <div className="neu-surface p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">
                  Weather
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <WeatherCard
                    location={LOCATIONS.utica.name}
                    latitude={LOCATIONS.utica.latitude}
                    longitude={LOCATIONS.utica.longitude}
                  />
                  <WeatherCard
                    location={LOCATIONS.rochester.name}
                    latitude={LOCATIONS.rochester.latitude}
                    longitude={LOCATIONS.rochester.longitude}
                  />
                </div>
              </div>

              {/* On Repeat - Music */}
              <div className="neu-surface p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">
                  On Repeat
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Album */}
                  <div className="neu-surface-inset p-4 rounded-lg">
                    <p className="text-xs text-neu-text-muted uppercase tracking-wide mb-3">Album</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={data.onRepeat.album.imageUrl}
                          alt={data.onRepeat.album.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neu-text-primary truncate">
                          {data.onRepeat.album.name}
                        </p>
                        <p className="text-xs text-neu-text-secondary truncate">
                          {data.onRepeat.album.artist}
                        </p>
                      </div>
                    </div>
                    {(data.onRepeat.album.spotifyURL || data.onRepeat.album.appleMusicURL) && (
                      <div className="flex items-center gap-2">
                        {data.onRepeat.album.spotifyURL && (
                          <Link
                            href={data.onRepeat.album.spotifyURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'neu-surface-inset-sm p-2 rounded-lg transition-all duration-300',
                              'flex items-center justify-center',
                              'hover:scale-105 active:scale-95',
                              'focus:outline-none focus:ring-2 focus:ring-neu-accent-light focus:ring-offset-2',
                              'text-neu-text-secondary hover:text-[#1DB954]'
                            )}
                            aria-label="Open album on Spotify"
                          >
                            <SiSpotify className="w-5 h-5" />
                          </Link>
                        )}
                        {data.onRepeat.album.appleMusicURL && (
                          <Link
                            href={data.onRepeat.album.appleMusicURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'neu-surface-inset-sm p-2 rounded-lg transition-all duration-300',
                              'flex items-center justify-center',
                              'hover:scale-105 active:scale-95',
                              'focus:outline-none focus:ring-2 focus:ring-neu-accent-light focus:ring-offset-2',
                              'text-neu-text-secondary hover:text-[#FA243C]'
                            )}
                            aria-label="Open album on Apple Music"
                          >
                            <SiApplemusic className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Song */}
                  <div className="neu-surface-inset p-4 rounded-lg">
                    <p className="text-xs text-neu-text-muted uppercase tracking-wide mb-3">Song</p>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={data.onRepeat.song.imageUrl}
                          alt={data.onRepeat.song.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neu-text-primary truncate">
                          {data.onRepeat.song.name}
                        </p>
                        <p className="text-xs text-neu-text-secondary truncate">
                          {data.onRepeat.song.artist}
                        </p>
                      </div>
                    </div>
                    {(data.onRepeat.song.spotifyURL || data.onRepeat.song.appleMusicURL) && (
                      <div className="flex items-center gap-2">
                        {data.onRepeat.song.spotifyURL && (
                          <Link
                            href={data.onRepeat.song.spotifyURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'neu-surface-inset-sm p-2 rounded-lg transition-all duration-300',
                              'flex items-center justify-center',
                              'hover:scale-105 active:scale-95',
                              'focus:outline-none focus:ring-2 focus:ring-neu-accent-light focus:ring-offset-2',
                              'text-neu-text-secondary hover:text-[#1DB954]'
                            )}
                            aria-label="Open song on Spotify"
                          >
                            <SiSpotify className="w-5 h-5" />
                          </Link>
                        )}
                        {data.onRepeat.song.appleMusicURL && (
                          <Link
                            href={data.onRepeat.song.appleMusicURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'neu-surface-inset-sm p-2 rounded-lg transition-all duration-300',
                              'flex items-center justify-center',
                              'hover:scale-105 active:scale-95',
                              'focus:outline-none focus:ring-2 focus:ring-neu-accent-light focus:ring-offset-2',
                              'text-neu-text-secondary hover:text-[#FA243C]'
                            )}
                            aria-label="Open song on Apple Music"
                          >
                            <SiApplemusic className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Currently Playing - Game */}
              <div className="neu-surface p-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-neu-text-primary">
                  Currently Playing
                </h3>
                <div className="flex items-center gap-4">
                  <div className="neu-surface-inset relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={data.currentlyPlaying.imageUrl}
                      alt={data.currentlyPlaying.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-neu-text-primary truncate">
                      {data.currentlyPlaying.name}
                    </p>
                    <p className="text-sm text-neu-text-secondary">Gaming</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
