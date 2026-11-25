#!/bin/sh
# Crea la base de pruebas de integración con el nombre de POSTGRES_DB_TEST.
# Solo corre la primera vez que se inicializa el volumen; para recrearla:
# pnpm db:reset.
set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" \
  -v base="$POSTGRES_DB_TEST" -v dueno="$POSTGRES_USER" <<'SQL'
CREATE DATABASE :"base" OWNER :"dueno";
SQL
