export function extractCardId(input: string): string {
  const cardPrefix = "card-";
  const prefixIndex = input.indexOf(cardPrefix);
  
  if (prefixIndex !== -1) {
    return input.slice(prefixIndex + cardPrefix.length);
  }
  
  return "";
}
