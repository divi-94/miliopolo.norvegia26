import { forecastForDate, forecastUrl, hourlyForDate, weatherCondition, type ForecastResponse, type WeatherPoint } from './weather';
import { osloDate, targetDay, TRIP_DATES, validSimulatedDate } from './trip';

const CACHE_TTL = 30 * 60 * 1000;
const CACHE_PREFIX = 'norvegia-weather-v1:';

interface CachedForecast {
  savedAt: number;
  data: ForecastResponse | ForecastResponse[];
}

interface LoadedForecast extends CachedForecast {
  stale: boolean;
}

function readCache(key: string): CachedForecast | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) ?? 'null') as CachedForecast | null;
    return parsed && typeof parsed.savedAt === 'number' && parsed.data ? parsed : null;
  } catch {
    return null;
  }
}

function writeCache(key: string, value: CachedForecast): void {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* cache non disponibile */ }
}

async function loadForecast(url: string): Promise<LoadedForecast> {
  const key = `${CACHE_PREFIX}${url}`;
  const cached = readCache(key);
  if (cached && Date.now() - cached.savedAt < CACHE_TTL) return { ...cached, stale: false };

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8_000);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Open-Meteo ${response.status}`);
    const value = { savedAt: Date.now(), data: await response.json() as ForecastResponse | ForecastResponse[] };
    writeCache(key, value);
    return { ...value, stale: false };
  } catch {
    if (cached) return { ...cached, stale: true };
    throw new Error('Previsione non disponibile');
  } finally {
    window.clearTimeout(timeout);
  }
}

function pointFrom(element: HTMLElement): WeatherPoint {
  return {
    name: element.dataset.weatherName ?? '',
    latitude: Number(element.dataset.latitude),
    longitude: Number(element.dataset.longitude),
    elevationM: element.dataset.elevation ? Number(element.dataset.elevation) : undefined,
  };
}

function text(element: HTMLElement, selector: string, value: string): void {
  const target = element.querySelector<HTMLElement>(selector);
  if (target) target.textContent = value;
}

function formatTime(value: string): string {
  return value.slice(11, 16);
}

function renderCompact(element: HTMLElement, forecast: ForecastResponse): void {
  const date = element.dataset.weatherDate ?? '';
  const daily = forecastForDate(forecast, date);
  if (!daily) {
    element.textContent = 'Meteo non ancora disponibile';
    return;
  }
  const condition = weatherCondition(daily.code);
  const rain = daily.precipitationProbability === null ? '—' : `${daily.precipitationProbability}%`;
  element.textContent = `${condition.symbol} ${Math.round(daily.temperatureMin)}–${Math.round(daily.temperatureMax)} °C · pioggia ${rain}`;
  element.title = condition.label;
}

function renderDetail(element: HTMLElement, forecast: ForecastResponse, loaded: LoadedForecast): void {
  const date = element.dataset.weatherDate ?? '';
  const daily = forecastForDate(forecast, date);
  const content = element.querySelector<HTMLElement>('[data-weather-content]');
  if (!daily) {
    text(element, '[data-weather-state]', 'Previsione non ancora disponibile per questa data.');
    if (content) content.hidden = true;
    return;
  }

  const condition = weatherCondition(daily.code);
  text(element, '[data-weather-state]', loaded.stale ? 'Ultima previsione salvata · dato non aggiornato' : condition.label);
  text(element, '[data-weather-condition]', `${condition.symbol} ${condition.label}`);
  text(element, '[data-weather-temperature]', `${Math.round(daily.temperatureMin)}–${Math.round(daily.temperatureMax)} °C`);
  text(element, '[data-weather-rain]', `${daily.precipitationProbability ?? '—'}% · ${daily.precipitation.toLocaleString('it-IT')} mm`);
  text(element, '[data-weather-wind]', `${Math.round(daily.wind)} km/h · raffiche ${Math.round(daily.gusts)} km/h`);
  text(element, '[data-weather-sun]', `${formatTime(daily.sunrise)} · ${formatTime(daily.sunset)}`);
  const updated = new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Oslo' }).format(new Date(loaded.savedAt));
  text(element, '[data-weather-updated]', `Aggiornato alle ${updated}${loaded.stale ? ' · dato non aggiornato' : ''}`);

  const hourly = element.querySelector<HTMLElement>('[data-weather-hourly]');
  if (hourly) {
    hourly.replaceChildren(...hourlyForDate(forecast, date).map((item) => {
      const card = document.createElement('div');
      const itemCondition = weatherCondition(item.code);
      const hour = document.createElement('strong');
      hour.textContent = item.time;
      const summary = document.createElement('span');
      summary.textContent = `${itemCondition.symbol} ${item.temperature === null ? '—' : `${Math.round(item.temperature)} °C`}`;
      const detail = document.createElement('small');
      detail.textContent = `Pioggia ${item.precipitationProbability ?? '—'}% · vento ${item.wind === null ? '—' : Math.round(item.wind)} km/h`;
      card.append(hour, summary, detail);
      return card;
    }));
  }
  if (content) content.hidden = false;
}

export async function loadWeatherWidgets(): Promise<void> {
  const all = [...document.querySelectorAll<HTMLElement>('[data-weather-point]')];
  if (!all.length) return;
  const detail = all.filter((element) => element.dataset.weatherMode === 'detail');
  let widgets = detail;
  if (!detail.length) {
    const params = new URLSearchParams(window.location.search);
    const current = validSimulatedDate(params.get('date')) ?? osloDate();
    const start = TRIP_DATES.indexOf(targetDay(current));
    const dates = new Set(TRIP_DATES.slice(start, start + 3));
    widgets = all.filter((element) => dates.has(element.dataset.weatherDate ?? ''));
  }
  if (!widgets.length) return;
  for (const element of widgets) element.hidden = false;
  const points = widgets.map(pointFrom);
  const detailed = detail.length > 0;
  try {
    const loaded = await loadForecast(forecastUrl(points, detailed));
    const forecasts = Array.isArray(loaded.data) ? loaded.data : [loaded.data];
    widgets.forEach((element, index) => {
      const forecast = forecasts[index];
      if (!forecast) return;
      if (detailed) renderDetail(element, forecast, loaded);
      else renderCompact(element, forecast);
    });
  } catch {
    for (const element of widgets) {
      if (detailed) text(element, '[data-weather-state]', 'Meteo temporaneamente non disponibile. Il resto del programma resta utilizzabile.');
      else element.textContent = 'Meteo non disponibile';
    }
  }
}
