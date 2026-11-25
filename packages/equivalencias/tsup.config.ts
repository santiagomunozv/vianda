import { defineConfig } from 'tsup';

export default defineConfig((opciones) => ({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  target: 'es2023',
  // En modo watch no se limpia dist: las apps que arrancan en paralelo
  // siguen viendo la compilación inicial mientras tsup recompila.
  clean: !opciones.watch,
}));
