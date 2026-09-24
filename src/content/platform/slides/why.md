---
notes: La idea central. Un deck es una carpeta que se versiona con git, se revisa en un PR y no depende de ningún editor de diapositivas.
---

## Un deck es una carpeta

- **Estructura** en `slides.yaml`: orden, layout, animación y tema de cada slide
- **Contenido** en `slides/<id>.md`: texto, HTML, código y componentes
- **Escena** con Reveal.js: transiciones, vista de presentador y navegación programable
- **Validación** al compilar: un tipo mal escrito o un id repetido rompe el build, no la charla
