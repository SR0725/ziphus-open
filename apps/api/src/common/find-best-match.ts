function findBestMatch(
  text: string,
  pattern: string,
  startFrom: number = 0
): number {
  const threshold = 0.75;
  let lastMatchIndex = -1;
  let lastMatchRatio = 0;

  for (let i = startFrom; i < text.length; i++) {
    let matchCount = 0;

    for (let j = 0; j < pattern.length; j++) {
      if (text.slice(i, i + pattern.length + 1).includes(pattern[j]!)) {
        matchCount++;
      }
    }
    const matchRatio = matchCount / pattern.length;
    if (matchRatio >= 0.999) {
      return i + 1;
    } else if (matchRatio >= threshold && matchRatio > lastMatchRatio) {
      lastMatchIndex = i + 1;
      lastMatchRatio = matchRatio;
    }
  }

  return lastMatchIndex;
}

export default findBestMatch;
