import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const slideContent = defineCollection({
  loader: glob({ pattern: "*/slides/*.{md,mdx}", base: "./src/content" }),
});

export const collections = { slideContent };