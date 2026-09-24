---
notes: El detalle que importa es getIndices. Reveal navega por horizontal y vertical, no por una lista plana, y un buscar-por-índice se rompe con stacks.
---

## Un solo punto de entrada

```ts
// lib/reveal/navigation.ts
goTo(slideId: string): boolean {
  const target = deck.getSlides().find((el) => el.dataset.slideId === slideId);
  if (!target) return false;

  const { h, v } = deck.getIndices(target); // también funciona dentro de un stack
  deck.slide(h, v);
  return true;
}
```
