export function assetUrl(slug: string, file: string): string {
  if (/^https?:\/\//.test(file) || file.startsWith("/")) return file;
  return `/content/${slug}/${file}`;
}
