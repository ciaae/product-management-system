export function normalizeTags(tags: unknown[], maxTags = 5): string[] {
  const normalized = tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  const unique: string[] = [];
  const seen = new Set<string>();

  for (const tag of normalized) {
    if (!seen.has(tag)) {
      seen.add(tag);
      unique.push(tag);
    }
  }

  return unique.slice(0, maxTags);
}

export function isDuplicateProductName(existingName: string, incomingName: string): boolean {
  return existingName.trim().toLowerCase() === incomingName.trim().toLowerCase();
}
