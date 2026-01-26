/**
 * Reverse geocode coordinates to human-readable location
 * Uses OpenStreetMap Nominatim API (free, no API key required)
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Formatted location string (e.g., "New York, NY, USA") or null on error
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<string | null> {
  try {
    // Nominatim requires a user agent header and has rate limits
    // Format: City, State/Region, Country
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Portfolio Contact Form', // Required by Nominatim
      },
    });

    if (!response.ok) {
      console.error('Reverse geocoding failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data.address) {
      return null;
    }

    const address = data.address;
    const parts: string[] = [];

    // Build location string: City, State/Region, Country
    if (address.city) {
      parts.push(address.city);
    } else if (address.town) {
      parts.push(address.town);
    } else if (address.village) {
      parts.push(address.village);
    }

    if (address.state) {
      parts.push(address.state);
    } else if (address.region) {
      parts.push(address.region);
    }

    if (address.country) {
      parts.push(address.country);
    }

    if (parts.length === 0) {
      // Fallback to display_name if address parts are missing
      return data.display_name || null;
    }

    return parts.join(', ');
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}

/**
 * Get geolocation from IP address
 * Uses ipapi.co API (free tier: 1000 requests/day)
 * @param ip - IP address to geolocate
 * @returns Formatted location string (e.g., "New York, NY, USA") or null on error
 */
export async function getIPGeolocation(ip: string): Promise<string | null> {
  try {
    // Skip for localhost/private IPs
    if (ip === 'unknown' || ip === '::1' || ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return null;
    }

    const url = `https://ipapi.co/${ip}/json/`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Portfolio Contact Form',
      },
    });

    if (!response.ok) {
      console.error('IP geolocation failed:', response.status);
      return null;
    }

    const data = await response.json();

    // Check for API error response
    if (data.error) {
      console.error('IP geolocation API error:', data.reason);
      return null;
    }

    const parts: string[] = [];

    // Build location string: City, State/Region, Country
    if (data.city) {
      parts.push(data.city);
    }

    if (data.region) {
      parts.push(data.region);
    } else if (data.region_code) {
      parts.push(data.region_code);
    }

    if (data.country_name) {
      parts.push(data.country_name);
    } else if (data.country_code) {
      parts.push(data.country_code);
    }

    if (parts.length === 0) {
      return null;
    }

    return parts.join(', ');
  } catch (error) {
    console.error('IP geolocation error:', error);
    return null;
  }
}
