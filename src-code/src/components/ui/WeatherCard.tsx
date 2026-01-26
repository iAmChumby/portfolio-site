'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { WeatherData } from '@/types/now';
import {
  fetchWeather,
  getWeatherDescription,
  getWeatherEmoji,
} from '@/lib/weather';

interface WeatherCardProps {
  location: string;
  latitude: number;
  longitude: number;
}

export default function WeatherCard({
  location,
  latitude,
  longitude,
}: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeather(latitude, longitude);
      setWeather(data);
    } catch (err) {
      setError('Unable to load weather');
      console.error('Weather fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    loadWeather();

    // Refresh weather every 10 minutes
    const interval = setInterval(loadWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadWeather]);

  if (loading) {
    return (
      <div className="neu-surface-inset p-4 rounded-lg animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neu-bg-dark/50" />
          <div className="flex-1">
            <div className="h-3 w-16 bg-neu-bg-dark/50 rounded mb-2" />
            <div className="h-5 w-12 bg-neu-bg-dark/50 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="neu-surface-inset p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neu-bg-dark/30 flex items-center justify-center">
            <span className="text-lg">⚠️</span>
          </div>
          <div>
            <p className="text-sm text-neu-text-secondary">{location}</p>
            <p className="text-xs text-neu-text-muted">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="neu-surface-inset p-4 rounded-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neu-bg-dark/30 flex items-center justify-center">
          <span className="text-xl">
            {getWeatherEmoji(weather.weatherCode, weather.isDay)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neu-text-secondary truncate">{location}</p>
          <p className="text-xl font-bold text-neu-text-primary">
            {weather.temperature}°F
          </p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-neu-text-muted">
        <span>{getWeatherDescription(weather.weatherCode)}</span>
        <span>💧 {weather.humidity}%</span>
      </div>
    </div>
  );
}
