# 0014. Sesión persistente y deslizante

Estado: Aceptada
Fecha: 2026-11-25

## Contexto
Vianda se usa varias veces al día y en momentos rápidos, justo antes o después de comer. Pedir la contraseña cada cierto tiempo rompe el principio de que registrar cueste un toque. A la vez, los registros son datos de salud y el usuario debe poder cortar el acceso.

## Decisión
- Token de acceso de vida corta y token de refresco con **vencimiento deslizante de 90 días**. Cada refresco rota el token, actualiza `ultimoUsoEn` y extiende `expiraEn` 90 días. La sesión solo vence tras 90 días sin uso.
- En `SesionRefresco` se guarda solo el hash del token, nunca el token.
- **Revocación** (`revocadoEn`): de una sesión al cerrar sesión; de todas las del usuario al cambiar la contraseña o con "cerrar sesión en todos los dispositivos".
- En el móvil, los tokens se guardan en `expo-secure-store`.
- Bloqueo con biometría opcional y desactivado por defecto, después de la fase 1. Las sesiones de profesionales (fase 3) serán más cortas.

## Consecuencias
- El usuario no vuelve a escribir la contraseña mientras use la app con regularidad.
- La rotación permite detectar el reúso de un token ya rotado y revocar la sesión.
- La API necesita una tabla de sesiones con un índice por hash de token, y depende de `expo-secure-store` en el móvil.
- Cambiar la contraseña obliga a iniciar sesión de nuevo en todos los dispositivos.
