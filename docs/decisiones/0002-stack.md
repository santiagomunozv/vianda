# 0002. Stack: Nest.js, React con Vite, Expo

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
Santiago domina React, React Native, Laravel y Nest.js. El monorepo gana valor si todo comparte un mismo lenguaje.

## Decisión
- API: Nest.js (TypeScript), en lugar de Laravel, para compartir tipos con los clientes.
- Web: React con Vite, sin Next.js: todo va detrás de inicio de sesión y no requiere renderizado en servidor ni SEO.
- Móvil: Expo con Expo Router.
- Validación compartida: Zod en `packages/shared`.
- Autenticación propia en la API (correo y contraseña, tokens de acceso y refresco), porque los permisos dependen de las membresías por espacio.

## Consecuencias
- Todo el proyecto es TypeScript.
- El inicio de sesión con proveedores externos (Google) se agrega después sobre la misma base.
