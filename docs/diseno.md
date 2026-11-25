# Guía de diseño de la interfaz

Esta guía describe cómo se ven y se comportan las pantallas. Los colores y tipografías exactos están en `docs/marca/marca.md`. Las capturas de referencia están en `docs/diseno/`; cuando una captura y este documento no coincidan, manda este documento.

## Principios

1. **Registrar debe costar un toque.** Nada de pasos de confirmación: se registra al tocar y se corrige con "Deshacer" o "Cambiar".
2. **La app abre lo correcto sola.** El usuario no debería tener que buscar qué le toca.
3. **Todo se registra con honestidad, nada se castiga.** Sin rojos, sin palabras como "pecar" o "trampa", sin mensajes de culpa. La app informa cómo quedó cada cosa, en tono neutro.
4. **El color identifica grupos, no estados de alerta.** Cada grupo de alimentos tiene su color; las opciones de alimentos son neutras.
5. **Nada de eslóganes.** Los textos son prácticos: dicen qué hacer o qué pasó.

## Estructura de las pantallas

### App móvil

- **Bloque marino arriba:** saludo, franja de comidas, título de la comida y anillo de avance.
- **Hoja de contenido abajo:** fondo cálido `fondo`, esquinas superiores redondeadas (28 px), que "sube" sobre el bloque marino.
- **Navegación inferior** con cuatro secciones: Hoy, Calculadora, Plan, Perfil.

### Web

- **Barra lateral marina** con el logo en círculo y las secciones: Mi plan (primera), Catálogo, Cuenta.
- **Contenido** sobre fondo `fondo`, con tarjetas blancas de borde suave.

## Componentes

### Anillo de avance

Círculo con trazo `turquesaClaro` sobre una pista blanca translúcida, en el bloque marino. En el centro, la cifra en Bricolage ("3/5"). Refleja las unidades cumplidas de la comida actual.

### Franja de comidas

Fila deslizable horizontal de píldoras, una por comida del plan, en el bloque marino. Soporta cualquier número de comidas. Tocar una píldora muestra esa comida. Estados (ver "Estados"):

| Estado | Apariencia |
| --- | --- |
| Actual o seleccionada | Fondo blanco, texto marino |
| Cumplida | Fondo blanco translúcido, chulito turquesa claro |
| Incompleta | Fondo blanco translúcido, punto a medias |
| Comida libre | Fondo blanco translúcido, flechas de intercambio turquesa claro |
| Fuera del plan | Fondo blanco translúcido, flechas de intercambio en gris claro |
| Omitida | Borde punteado, guion |
| Pendiente | Contorno sólido translúcido |
| Sin registrar | Contorno punteado |

### Grupo de la comida (acordeón)

Una fila por grupo de la comida: cuadrito del color del grupo, nombre, puntos de avance, estado ("0 de 1", "Listo") y una flecha al final.

- Toda la fila es tocable; la flecha apunta hacia abajo cerrado y hacia arriba abierto.
- **Un solo grupo abierto a la vez.**
- **Abierto**, la fila y su contenido se envuelven en una tarjeta blanca con borde `borde`. Cerrado, es una fila plana.
- **Cerrado y con registros**, muestra un resumen bajo el nombre: los alimentos elegidos o "1 sin detallar".
- **Apertura automática:** al completar un grupo, se cierra y se abre el siguiente grupo pendiente de la comida.

Contenido del grupo abierto, en este orden:

1. Lo ya registrado, cada uno con "Quitar".
2. El título "Elige una opción para 1 unidad", o "¿Cuál fue? Elige para detallar" si hay unidades sin detallar.
3. Las opciones de alimentos: tarjetas blancas con nombre y cantidad para una unidad ("Pechuga de pollo · 120 g crudo"). Ordenadas por lo que el usuario más come.
4. "Ya la comí, sin detallar": borde punteado, ícono de punto a medias en el color del grupo, subtítulo "Podrás decir cuál fue más tarde". Solo si quedan unidades pendientes.

### Puntos de avance

Un punto por unidad del grupo, de 12 px:

| Estado de la unidad | Punto |
| --- | --- |
| Pendiente | Solo borde del color del grupo |
| Detallada | Relleno del color del grupo |
| Sin detallar | Relleno a medias (mitad izquierda) |

### "¿Pasó algo distinto?"

Debajo de los grupos de cada comida, dos tarjetas secundarias con ícono, título, subtítulo y flecha:

- **"Comí otra cosa"**, con subtítulo "Te queda 1 comida libre esta semana" o "Ya usaste tu comida libre esta semana". Abre una hoja inferior.
- **"No la comí"**, con subtítulo "Quedará registrada como omitida".

### Hoja "Comí otra cosa"

Hoja que sube desde abajo, con fondo oscurecido detrás:

- Título "Comí otra cosa" y subtítulo "En lugar de la [comida] de tu plan."
- Campo opcional "¿Qué comiste?".
- Aviso según el caso: `info` con "Contará como tu comida libre de esta semana", o `neutro` con "Tu comida libre de esta semana ya la usaste el [día], así que esta quedará como fuera del plan. Se registra igual."
- Botones "Guardar" (principal) y "Cancelar".

### Aviso con "Deshacer"

Aviso flotante oscuro sobre el contenido, encima del botón inferior: "Registrado: pechuga de pollo" con "Deshacer" en `turquesaClaro`. Aparece tras cada registro.

### Botón "Registrar otro alimento"

Botón secundario (borde marino, fondo blanco) al final de la hoja. Sirve para lo que no está en las opciones; si no cubre una unidad del plan, queda como extra fuera del plan.

### Barra de cumplimiento

Barra segmentada por motivo, debajo del porcentaje de cumplimiento: cumplidas (marino), fuera del plan (gris neutro), omitidas (gris más claro), sin registrar (borde punteado). Así se ve por qué no se cumplió algo, no solo cuánto.

## Pantallas

### App

| Pantalla | Comportamiento clave | Captura |
| --- | --- | --- |
| Inicio de sesión | Logo en círculo centrado en el bloque marino; hoja con correo, contraseña con "Mostrar", "¿Olvidaste tu contraseña?", "Ingresar", "Regístrate" | `app-inicio-sesion.png` |
| Hoy: comida actual | Franja, anillo, grupos en acordeón con el siguiente pendiente abierto | `app-hoy-actual.png` |
| Hoy: entre comidas | La próxima comida como título ("en 50 min"); aviso de lo pendiente de la anterior con "Completar"; la próxima se puede registrar antes | `app-hoy-entre-comidas.png` |
| Hoy: día completo | Anillo lleno, resumen por grupo, "Detallado: 14 de 15" con "Detallar", con qué empieza mañana | `app-hoy-dia-completo.png` |
| Hoy: primera vez | Sin plan: tres pasos (catálogo en la web, armar plan, volver), "Enviarme el enlace por correo", acceso a la calculadora | `app-hoy-primera-vez.png` |
| Comí otra cosa | Opciones, hoja y resultado, con y sin comida libre disponible | `app-comi-otra-cosa-*.png` |
| Calculadora | Dos modos: "¿Cuánto es?" (unidades → cantidad en crudo, cocido y medida casera) y "¿Cuántas unidades?" (cantidad → unidades) | `app-calculadora.png` |

"Hoy" decide qué mostrar así: si el plan tiene horas, la comida cuya hora es la actual o la última pasada con pendientes; si no tiene horas, la primera comida del día con pendientes, en el orden del plan.

### Web

| Pantalla | Comportamiento clave | Captura |
| --- | --- | --- |
| Inicio de sesión | Panel marino liso con el logo en círculo; formulario a la derecha con "Aquí configuras tu catálogo y tu plan." | `web-inicio-sesion.png` |
| Mi plan (home) | Versión vigente, total de unidades por día por grupo, una tarjeta por comida; "Editar plan" crea una versión nueva | `web-mi-plan.png` |
| Primera vez | Tres tarjetas de pasos con el actual resaltado | `web-primera-vez.png` |
| Catálogo | Grupos a la izquierda; tabla de alimentos del grupo (crudo, cocido, medida casera, origen: Base, Propio o Modificado); edición del alimento a la derecha con el cálculo del cocido a la vista | `web-catalogo.png` |

## Textos

- Español neutro, tuteo.
- Tono práctico y amable; nunca de reproche.
- Formatos: "12:30 p. m.", "120 g", "1,5 unidades" (coma decimal).
- Estados con palabras de hechos: "Comí otra cosa", "No la comí", "Fuera del plan". No usar "pecar", "trampa", "fallaste".

## Accesibilidad

- Áreas tocables de al menos 44 × 44 px.
- Toda acción tiene un control visible: no hay acciones que solo existan como gesto.
- Contraste de texto AA. El turquesa `#1C93A6` no se usa para texto pequeño.
- La información no depende solo del color: los estados llevan ícono o texto además del color.
