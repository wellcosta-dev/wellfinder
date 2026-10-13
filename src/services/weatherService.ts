import { WeatherData } from '../types/ip';

export async function fetchWeather(lat?: number, lon?: number): Promise<WeatherData> {
  if (typeof lat !== 'number' || typeof lon !== 'number' || isNaN(lat) || isNaN(lon)) {
    return {
      temp: 20,
      condition: 'Clear Sky',
      wind: 10,
      humidity: 50
    };
  }

  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`
    );
    if (!res.ok) throw new Error('Weather API error');
    const data = await res.json();
    const code = data.current?.weather_code ?? 0;

    let condition = 'Clear / Sunny';
    if (code >= 1 && code <= 3) condition = 'Partly Cloudy';
    else if (code >= 45 && code <= 48) condition = 'Foggy';
    else if (code >= 51 && code <= 67) condition = 'Rainy';
    else if (code >= 71 && code <= 86) condition = 'Snowy';
    else if (code >= 95) condition = 'Thunderstorm';

    return {
      temp: Math.round(data.current?.temperature_2m ?? 20),
      condition,
      wind: Math.round(data.current?.wind_speed_10m ?? 12),
      humidity: Math.round(data.current?.relative_humidity_2m ?? 50)
    };
  } catch {
    return {
      temp: 21,
      condition: 'Clear Sky',
      wind: 12,
      humidity: 48
    };
  }
}
