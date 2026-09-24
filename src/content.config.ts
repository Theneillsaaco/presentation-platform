import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const slideContent = defineCollection({
  loader: glob({ pattern: "*/slides/*.{md,mdx}", base: "./src/content" }),
  schema: z.object({ notes: z.string().optional() }).strict(),
});

export const collections = { slideContent };