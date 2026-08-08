const WORDS_PER_MINUTE = 200;

export function readingMinutes(markdown: string): number {
  const plainText = markdown
    .replace(/^---[\s\S]*?---/u, '')
    .replace(/[`*_#[\]()>.!–—“”]/gu, ' ')
    .trim();
  const words = plainText ? plainText.split(/\s+/u).length : 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export const curiosityTypeLabel = {
  storia: 'Storia',
  fatto: 'Fatto',
  leggenda: 'Leggenda',
} as const;
