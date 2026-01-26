import { WeatherData, WeatherCondition } from '@/types/now';

/**
 * Fetch weather data from Open-Meteo API
 */
export async function fetchWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.append('latitude', latitude.toString());
  url.searchParams.append('longitude', longitude.toString());
  url.searchParams.append(
    'current',
    'temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,is_day'
  );
  url.searchParams.append('temperature_unit', 'fahrenheit');
  url.searchParams.append('wind_speed_unit', 'mph');
  url.searchParams.append('timezone', 'auto');

  const response = await fetch(url.toString(), {
    next: { revalidate: 600 }, // Cache for 10 minutes
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const data = await response.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    isDay: data.current.is_day === 1,
  };
}

/**
 * Map WMO weather codes to condition types
 * https://open-meteo.com/en/docs#weathervariables
 */
export function getWeatherCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear';
  if (code >= 1 && code <= 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 55) return 'drizzle';
  if (code >= 56 && code <= 57) return 'freezing-rain';
  if (code >= 61 && code <= 65) return 'rain';
  if (code >= 66 && code <= 67) return 'freezing-rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'cloudy';
}

/**
 * Get human-readable weather description
 */
export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow',
    73: 'Moderate snow',
    75: 'Heavy snow',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail',
  };

  return descriptions[code] || 'Unknown';
}

/**
 * Get weather emoji for display
 */
export function getWeatherEmoji(code: number, isDay: boolean): string {
  const condition = getWeatherCondition(code);

  const emojiMap: Record<WeatherCondition, { day: string; night: string }> = {
    'clear': { day: '☀️', night: '🌙' },
    'partly-cloudy': { day: '⛅', night: '☁️' },
    'cloudy': { day: '☁️', night: '☁️' },
    'fog': { day: '🌫️', night: '🌫️' },
    'drizzle': { day: '🌦️', night: '🌧️' },
    'rain': { day: '🌧️', night: '🌧️' },
    'freezing-rain': { day: '🌨️', night: '🌨️' },
    'snow': { day: '❄️', night: '❄️' },
    'thunderstorm': { day: '⛈️', night: '⛈️' },
  };

  const emoji = emojiMap[condition];
  return isDay ? emoji.day : emoji.night;
}

/**
 * Pre-configured locations
 */
export const LOCATIONS = {
  utica: {
    name: 'Utica, NY',
    latitude: 43.1009,
    longitude: -75.2327,
  },
  rochester: {
    name: 'Rochester, NY',
    latitude: 43.1566,
    longitude: -77.6088,
  },
} as const;
