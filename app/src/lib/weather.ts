export interface WeatherPoint {
  name: string;
  latitude: number;
  longitude: number;
  elevationM?: number;
}

export interface ForecastResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_min: number[];
    temperature_2m_max: number[];
    precipitation_probability_max: Array<number | null>;
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };
  hourly?: {
    time: string[];
    temperature_2m: Array<number | null>;
    precipitation_probability: Array<number | null>;
    weather_code: number[];
    wind_speed_10m: Array<number | null>;
    wind_gusts_10m: Array<number | null>;
  };
}

const conditions: Record<number, { label: string; symbol: string }> = {
  0: { label: 'Sereno', symbol: '☀' },
  1: { label: 'Prevalentemente sereno', symbol: '🌤' },
  2: { label: 'Parzialmente nuvoloso', symbol: '⛅' },
  3: { label: 'Coperto', symbol: '☁' },
  45: { label: 'Nebbia', symbol: '≋' },
  48: { label: 'Nebbia con brina', symbol: '≋' },
  51: { label: 'Pioviggine debole', symbol: '🌦' },
  53: { label: 'Pioviggine', symbol: '🌦' },
  55: { label: 'Pioviggine intensa', symbol: '🌧' },
  56: { label: 'Pioviggine gelata debole', symbol: '🌧' },
  57: { label: 'Pioviggine gelata', symbol: '🌧' },
  61: { label: 'Pioggia debole', symbol: '🌦' },
  63: { label: 'Pioggia', symbol: '🌧' },
  65: { label: 'Pioggia intensa', symbol: '🌧' },
  66: { label: 'Pioggia gelata debole', symbol: '🌧' },
  67: { label: 'Pioggia gelata', symbol: '🌧' },
  71: { label: 'Neve debole', symbol: '❄' },
  73: { label: 'Neve', symbol: '❄' },
  75: { label: 'Neve intensa', symbol: '❄' },
  77: { label: 'Granelli di neve', symbol: '❄' },
  80: { label: 'Rovesci deboli', symbol: '🌦' },
  81: { label: 'Rovesci', symbol: '🌧' },
  82: { label: 'Rovesci intensi', symbol: '🌧' },
  85: { label: 'Rovesci di neve', symbol: '❄' },
  86: { label: 'Rovesci di neve intensi', symbol: '❄' },
  95: { label: 'Temporale', symbol: '⚡' },
  96: { label: 'Temporale con grandine', symbol: '⚡' },
  99: { label: 'Temporale forte con grandine', symbol: '⚡' },
};

export function weatherCondition(code: number): { label: string; symbol: string } {
  return conditions[code] ?? { label: 'Condizioni variabili', symbol: '•' };
}

export function forecastUrl(points: WeatherPoint[], detailed: boolean): string {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', points.map((point) => point.latitude).join(','));
  url.searchParams.set('longitude', points.map((point) => point.longitude).join(','));
  if (points.length === 1 && points[0].elevationM !== undefined) url.searchParams.set('elevation', String(points[0].elevationM));
  url.searchParams.set('daily', [
    'weather_code', 'temperature_2m_min', 'temperature_2m_max',
    'precipitation_probability_max', 'precipitation_sum',
    'wind_speed_10m_max', 'wind_gusts_10m_max', 'sunrise', 'sunset',
  ].join(','));
  if (detailed) {
    url.searchParams.set('hourly', [
      'temperature_2m', 'precipitation_probability', 'weather_code',
      'wind_speed_10m', 'wind_gusts_10m',
    ].join(','));
  }
  url.searchParams.set('timezone', 'Europe/Oslo');
  url.searchParams.set('forecast_days', '16');
  return url.toString();
}

export function forecastForDate(forecast: ForecastResponse, date: string) {
  const index = forecast.daily.time.indexOf(date);
  if (index < 0) return null;
  return {
    code: forecast.daily.weather_code[index],
    temperatureMin: forecast.daily.temperature_2m_min[index],
    temperatureMax: forecast.daily.temperature_2m_max[index],
    precipitationProbability: forecast.daily.precipitation_probability_max[index],
    precipitation: forecast.daily.precipitation_sum[index],
    wind: forecast.daily.wind_speed_10m_max[index],
    gusts: forecast.daily.wind_gusts_10m_max[index],
    sunrise: forecast.daily.sunrise[index],
    sunset: forecast.daily.sunset[index],
  };
}

export function hourlyForDate(forecast: ForecastResponse, date: string) {
  if (!forecast.hourly) return [];
  const hours = new Set(['06:00', '12:00', '18:00', '22:00']);
  return forecast.hourly.time.flatMap((time, index) => {
    if (!time.startsWith(`${date}T`) || !hours.has(time.slice(11))) return [];
    return [{
      time: time.slice(11),
      code: forecast.hourly!.weather_code[index],
      temperature: forecast.hourly!.temperature_2m[index],
      precipitationProbability: forecast.hourly!.precipitation_probability[index],
      wind: forecast.hourly!.wind_speed_10m[index],
      gusts: forecast.hourly!.wind_gusts_10m[index],
    }];
  });
}
