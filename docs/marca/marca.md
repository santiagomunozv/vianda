# Marca

## Archivos

| Archivo | Uso |
| --- | --- |
| `simbolo.svg` | Símbolo a color sobre fondos claros |
| `simbolo-blanco.svg` | Símbolo sobre fondos oscuros (marino) |
| `logo-horizontal.svg` | Símbolo + nombre, sobre fondos claros (encabezado web, login) |
| `logo-horizontal-blanco.svg` | Símbolo + nombre, sobre fondo marino |
| `icono-app.svg` | Fuente del ícono de la app |
| `favicon.svg` | Favicon de la web |
| `png/icon.png` | Ícono de Expo (1024 × 1024, fondo sólido) → `expo.icon` |
| `png/adaptive-icon.png` | Primer plano del ícono adaptativo de Android, fondo transparente → `android.adaptiveIcon.foregroundImage`, con `backgroundColor: "#12355B"` |
| `png/splash-icon.png` | Imagen de la pantalla de carga, fondo transparente; usar con fondo `#FFFFFF` |
| `png/favicon.png` | Favicon de 48 px |

El nombre "vianda" en los logos está convertido a trazos: no depende de tener Manrope instalada. En las apps se copian a `apps/web/public/` y `apps/mobile/assets/`.

## Colores

| Token | Valor | Uso |
| --- | --- | --- |
| `primario` | `#12355B` | Logo, botones principales, encabezados, fondo del ícono |
| `acento` | `#1C93A6` | Elementos destacados sobre fondo claro, el huevo del símbolo |
| `acentoSobreOscuro` | `#7FD3DF` | El huevo y acentos sobre fondo marino |
| `fondoSuave` | `#EEF3F8` | Superficies, tarjetas, secciones |
| `tinta` | `#102A33` | Texto principal |
| `tintaSecundaria` | `#4A5B61` | Texto secundario, etiquetas |
| `borde` | `#DCE4E5` | Bordes y separadores |

Texto sobre `primario`: siempre blanco. No usar `acento` para texto pequeño sobre blanco: no alcanza contraste suficiente; para texto usar `primario`.

## Tipografía

Manrope (Google Fonts), pesos 500, 600 y 700.

- El nombre se escribe siempre **"vianda"**, en minúscula.
- Títulos en 700, subtítulos y botones en 600, texto en 500.

## Usos correctos

- Dejar alrededor del logo un espacio libre al menos igual a la altura del huevo.
- Sobre fondos claros, versión a color; sobre marino, versión blanca.
- Tamaño mínimo del símbolo: 24 px.

## Usos incorrectos

- No cambiar los colores del símbolo fuera de las dos versiones.
- No deformar, rotar ni agregar sombras o degradados.
- No escribir el nombre con mayúscula inicial en el logo.
