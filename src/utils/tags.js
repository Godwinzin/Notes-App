export const MAX_TAGS = 5
const MAX_TAG_LENGTH = 20

export function parseTags(text) {
  const tags = text
    .split(",")
    .map((tag) => tag.trim().toLowerCase().slice(0, MAX_TAG_LENGTH))
    .filter(Boolean)

  return [...new Set(tags)].slice(0, MAX_TAGS)
}