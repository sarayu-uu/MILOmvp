/** Fresh on activity entry, stable while playing. Avoid repeating the last arrangement. */
export function shuffle<T>(items: readonly T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
export function freshShuffle<T>(key: string, items: readonly T[]): T[] {
  let result = shuffle(items)
  try {
    const storageKey = `milo-variation-${key}`
    if (items.length > 1 && localStorage.getItem(storageKey) === JSON.stringify(result)) result = [...result.slice(1), result[0]]
    localStorage.setItem(storageKey, JSON.stringify(result))
  } catch { /* Variation still works without storage. */ }
  return result
}
