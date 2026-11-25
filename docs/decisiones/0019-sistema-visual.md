# 0019. Sistema visual: neutros cálidos, color por grupo y dos tipografías

Estado: Aceptada
Fecha: 2026-11-25

## Contexto
Vianda trata datos de alimentación, un tema donde las apps suelen usar rojos, alertas y lenguaje de culpa. La identidad tiene que sentirse clínica y confiable sin castigar, y ser igual en la web y en el móvil.

## Decisión
- **Neutros cálidos** tipo papel (`fondo` `#FAF8F4`, `superficie`, `borde`, `tinta`…) en lugar de grises azulados. Reemplazan al fondo anterior `#EEF3F8`.
- **Color por grupo:** cada grupo tiene un color, un tinte y una tinta oscura de la paleta de `docs/marca/marca.md`. El color se guarda con el grupo y se usa solo en el cuadrito del grupo, en los puntos de avance y en los segmentos de barras. Las opciones de alimentos son siempre neutras.
- **Sin colores de alerta** sobre lo que comió el usuario: "Fuera del plan" usa el neutro y nunca rojo.
- **Tipografía:** Bricolage Grotesque (600, 700) para títulos y cifras; Manrope (500, 600, 700) para el resto de la interfaz y para el nombre "vianda".
- **Logo en círculo blanco** sobre marino en el inicio de sesión y en la barra lateral de la web; símbolo blanco sin círculo en los encabezados de la app.
- Los tokens se definen una sola vez y se comparten entre web y móvil en el paso 7 de la fase 1.

## Consecuencias
- Los grupos nuevos eligen de la paleta; si se necesitan más colores, se agregan primero en `docs/marca/marca.md` con su tinte y su tinta oscura.
- Hay que cargar dos familias tipográficas en la web y en Expo.
- La información nunca depende solo del color: los estados llevan además ícono o texto.
