import { urlBaseDeDatos } from './base-de-datos.js';

const entorno = {
  POSTGRES_HOST: 'localhost',
  POSTGRES_PORT: '5432',
  POSTGRES_USER: 'vianda',
  POSTGRES_PASSWORD: 'vianda',
  POSTGRES_DB: 'vianda',
  POSTGRES_DB_TEST: 'vianda_test',
};

describe('urlBaseDeDatos', () => {
  it('construye la URL de la base principal', () => {
    expect(urlBaseDeDatos(entorno)).toBe(
      'postgresql://vianda:vianda@localhost:5432/vianda?schema=public',
    );
  });

  it('usa la base de pruebas cuando se pide', () => {
    expect(urlBaseDeDatos(entorno, { prueba: true })).toBe(
      'postgresql://vianda:vianda@localhost:5432/vianda_test?schema=public',
    );
  });

  it('codifica caracteres especiales de usuario y contraseña', () => {
    const url = urlBaseDeDatos({
      ...entorno,
      POSTGRES_USER: 'yo@casa',
      POSTGRES_PASSWORD: 'a:b/c?',
    });
    expect(url).toBe('postgresql://yo%40casa:a%3Ab%2Fc%3F@localhost:5432/vianda?schema=public');
  });

  it('falla nombrando las variables que faltan, sin mostrar valores', () => {
    const { POSTGRES_PASSWORD: _clave, POSTGRES_PORT: _puerto, ...incompleto } = entorno;
    expect(() => urlBaseDeDatos({ ...incompleto, POSTGRES_PORT: 'abc' })).toThrow(
      /POSTGRES_PORT, POSTGRES_PASSWORD/,
    );
  });
});
