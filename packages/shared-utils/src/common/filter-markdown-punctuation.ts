export function filterMarkdownPunctuation(text: string): string {
  return text
    .replaceAll("**", "")
    .replaceAll("#", "")
    .replaceAll("##", "")
    .replaceAll("###", "")
    .replaceAll("####", "")
    .replaceAll("#####", "")
    .replaceAll("######", "");
}
