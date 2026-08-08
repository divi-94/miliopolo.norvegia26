const normalizedBase = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

export function pathWithBase(path = ''): string {
  return `${normalizedBase}${path.replace(/^\/+/, '')}`;
}
