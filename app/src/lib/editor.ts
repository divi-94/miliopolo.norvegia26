export const repositoryUrl = 'https://github.com/divi-94/miliopolo.norvegia26';

export function dayEditorUrl(date: string): string {
  return `${repositoryUrl}/edit/main/app/src/content/days/${encodeURIComponent(date)}.md`;
}

export const actionsUrl = `${repositoryUrl}/actions`;
