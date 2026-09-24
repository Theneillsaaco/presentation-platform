/**
 * Resolves a deck's public asset path, e.g. "diagram.png" -> "/content/aerospace/diagram.png".
 * Assets are served from public/content/<slug>/ (see README "Adding assets").
 */
export function assetUrl(slug: string, file: string): string {
  if (/^https?:\/\//.test(file) || file.startsWith("/")) return file;
  return `/content/${slug}/${file}`;
}
