---
notes: Mostrar la correspondencia 1 a 1 entre una entrada del YAML y un archivo de contenido. El id es el enlace.
---

## Dos archivos por slide

- `id` enlaza con `slides/results.mdx`
- `type` elige el layout de la slide
- `animation` corre cada vez que llegas a ella
- `theme` fuerza claro u oscuro solo ahí
- `background` acepta color, gradiente, imagen o video

```yaml
# slides.yaml
- id: results
  type: chart
  animation: reveal
  theme: light
  background:
    gradient: "linear-gradient(...)"
```
