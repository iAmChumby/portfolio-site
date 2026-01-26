// Type definitions for the /now page

/**
 * Weather data from Open-Meteo API
 */
export interface WeatherData {
  temperature: number;
  weatherCode: number;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
}

/**
 * Location with weather state
 */
export interface LocationWeather {
  location: string;
  latitude: number;
  longitude: number;
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
}

/**
 * Weather condition types for icon mapping
 */
export type WeatherCondition =
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'freezing-rain'
  | 'snow'
  | 'thunderstorm';

/**
 * A post/update on the /now page
 */
export interface NowPost {
  id: string;
  date: string;
  title: string;
  body: string;
}

/**
 * Availability status
 */
export interface Availability {
  status: 'open' | 'busy' | 'unavailable';
  message: string;
}

/**
 * Currently playing game
 */
export interface CurrentlyPlaying {
  name: string;
  imageUrl: string;
}

/**
 * Media item (album or song)
 */
export interface MediaItem {
  name: string;
  artist: string;
  imageUrl: string;
}

/**
 * On repeat section
 */
export interface OnRepeat {
  album: MediaItem;
  song: MediaItem;
}

/**
 * Complete /now page data structure
 */
export interface NowData {
  availability: Availability;
  currentlyPlaying: CurrentlyPlaying;
  onRepeat: OnRepeat;
  posts: NowPost[];
}
