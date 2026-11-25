# 0011. Docker solo para servicios de desarrollo

Estado: Aceptada
Fecha: 2026-11-24

## Contexto
El desarrollo necesita PostgreSQL local. Contenerizar también las apps complica la recarga en caliente, el empaquetador de Expo y la depuración, sin aportar nada mientras no exista un entorno de producción.

## Decisión
- `docker-compose.yml` en la raíz levanta solo servicios: por ahora PostgreSQL 17, con la base `vianda` y la base `vianda_test` para pruebas de integración.
- La API, la web y la app móvil corren nativas con `pnpm dev`.
- El Dockerfile de la API se definirá cuando se elija el proveedor de despliegue.

## Consecuencias
- `pnpm db:up` y `pnpm db:down` gestionan los servicios; el resto del flujo no depende de Docker.
- Las versiones de Node y de PostgreSQL de desarrollo deben revisarse frente a las de producción cuando se elija proveedor.
