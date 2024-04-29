export function getSimplifyStringDiff(
  s1: string,
  s2: string
): { startPosition: number; endPosition: number; insertText: string } {
  let i = 0,
    j = 0;
  let start = -1,
    end = -1;

  // 從頭開始比較找到第一個不同的位置
  while (i <= s1.length && j <= s2.length) {
    if (s1[i] !== s2[j]) {
      start = i - 1;
      break;
    }
    i++;
    j++;
  }

  // 從後往前比較找到最後一個不同的位置
  end = s1.length;
  i = s1.length - 1;
  j = s2.length - 1;
  while (i > start && j > start) {
    if (s1[i] !== s2[j]) {
      end = i + 1;
      break;
    }
    i--;
    j--;
    end = i + 1;
  }

  const insertText = s2.substring(start + 1, j + 1);

  return {
    startPosition: start,
    endPosition: end,
    insertText: insertText,
  };
}
