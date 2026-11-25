# Marca

## Archivos

| Archivo | Uso |
| --- | --- |
| `simbolo.svg` | Símbolo a color sobre fondos claros |
| `simbolo-blanco.svg` | Símbolo sobre fondos oscuros (marino) |
| `logo-horizontal.svg` | Símbolo + nombre, sobre fondos claros |
| `logo-horizontal-blanco.svg` | Símbolo + nombre, sobre fondo marino |
| `icono-app.svg` | Fuente del ícono de la app |
| `favicon.svg` | Favicon de la web |
| `png/icon.png` | Ícono de Expo (1024 × 1024, fondo sólido) → `expo.icon` |
| `png/adaptive-icon.png` | Primer plano del ícono adaptativo de Android → `android.adaptiveIcon.foregroundImage`, con `backgroundColor: "#12355B"` |
| `png/splash-icon.png` | Imagen de la pantalla de carga, fondo transparente |
| `png/favicon.png` | Favicon de 48 px |

El nombre "vianda" en los logos está convertido a trazos. En las apps se copian a `apps/web/public/` y `apps/mobile/assets/`.

## Logo en las pantallas

- **Inicio de sesión (app y web):** el símbolo a color dentro de un **círculo blanco**, centrado sobre el bloque marino, con "vianda" debajo en blanco. Sin eslogan.
- **Barra lateral de la web:** círculo blanco pequeño con el símbolo a color, y "vianda" en blanco al lado.
- **Encabezados de la app:** símbolo blanco con huevo turquesa claro, sin círculo.

## Colores de marca

| Token | Valor | Uso |
| --- | --- | --- |
| `marino` | `#12355B` | Bloques de encabezado, barra lateral web, botones principales, títulos sobre claro |
| `turquesa` | `#1C93A6` | Huevo del símbolo sobre claro; acentos gráficos (no para texto pequeño) |
| `turquesaClaro` | `#7FD3DF` | Huevo y acentos sobre marino: anillo de avance, rótulos como "AHORA TE TOCA" |
| `marinoTextoSuave` | `#B9CBDB` | Texto secundario sobre marino |

## Neutros cálidos

Vianda usa neutros cálidos (tipo papel), no grises azulados.

| Token | Valor | Uso |
| --- | --- | --- |
| `fondo` | `#FAF8F4` | Fondo de la hoja de contenido y de la web |
| `superficie` | `#FFFFFF` | Tarjetas, campos, grupo abierto |
| `superficieSuave` | `#F6F3EE` | Celdas de resumen, áreas secundarias |
| `borde` | `#E6E1D8` | Bordes de tarjetas y separadores |
| `bordeCampo` | `#DDD6CA` | Bordes de campos de formulario y botones secundarios |
| `bordePunteado` | `#9FB0B8` | Borde punteado de acciones secundarias ("Ya la comí, sin detallar") |
| `tinta` | `#1B2430` | Texto principal |
| `tintaSecundaria` | `#5C6670` | Texto secundario, etiquetas, estados |
| `info` | `#E3EEF6` | Avisos informativos (texto `#12355B` o `#1E3A52`) |
| `neutro` | `#F1EEE8` | Avisos y etiquetas neutras, como "Fuera del plan" (texto `#3B4C56` o `#4A5560`) |
| `oscuro` | `#102A33` | Fondo del aviso flotante con "Deshacer" |

## Colores por grupo de alimentos

Cada grupo tiene un color propio. Se usa **solo** en el cuadrito del grupo, en sus puntos de avance y en los segmentos de las barras. Las opciones de alimentos van siempre neutras (blancas), nunca con el color del grupo de fondo.

| Grupo | Color | Tinte (fondos suaves) | Tinta oscura (texto sobre tinte) |
| --- | --- | --- | --- |
| Proteína | `#C8553D` | `#F6DDD6` | `#8E3523` |
| Harina | `#C99A2E` | `#F5E7C8` | `#7A5A14` |
| Verdura | `#5B8C5A` | `#DCE9DA` | `#2F5A2E` |
| Grasa | `#7A8B3C` | `#E6E9D3` | `#4E5A1E` |
| Lácteo | `#5E93B5` | `#DCE9F2` | `#2E5A78` |
| Fruta | `#C2577A` | `#F3DCE4` | `#8A2F50` |

Los grupos son configurables: el color se guarda con el grupo. Los grupos nuevos eligen de esta paleta; si se necesitan más, se agregan aquí con su tinte y su tinta oscura.

## Tipografía

| Familia | Pesos | Uso |
| --- | --- | --- |
| Bricolage Grotesque | 600, 700 | Títulos de pantalla y de comida, cifras del anillo y de avance |
| Manrope | 500, 600, 700 | Todo el texto de interfaz y el nombre "vianda" del logo |

- No se usan tipografías con serifa.
- El nombre se escribe siempre **"vianda"**, en minúscula, en Manrope 700.

## Usos incorrectos

- No cambiar los colores del símbolo fuera de sus versiones.
- No usar los colores de grupo como fondo de botones u opciones.
- No usar rojo para alertas sobre lo que comió el usuario: Vianda no regaña.
- No agregar eslóganes junto al logo.
