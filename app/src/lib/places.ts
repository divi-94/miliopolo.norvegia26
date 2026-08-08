import { parse } from 'yaml';
import placesYaml from '../data/places.yml?raw';

export interface Place {
  slug: string;
  name: string;
  area: string;
  coordinates?: { latitude: number; longitude: number };
  elevationM?: number;
  mapUrl?: string;
  officialUrl?: string;
}

let cache: Place[] | undefined;

export function getPlaces(): Place[] {
  cache ??= parse(placesYaml) as Place[];
  return cache;
}

export function getPlace(slug: string): Place | undefined {
  return getPlaces().find((place) => place.slug === slug);
}

export function mapUrlFor(place: Place): string {
  if (place.mapUrl) return place.mapUrl;
  const query = encodeURIComponent(`${place.name}, ${place.area}, Norway`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
