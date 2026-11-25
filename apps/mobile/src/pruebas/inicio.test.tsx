import { render, screen } from '@testing-library/react-native';
import Inicio from '../app/index';

describe('Inicio', () => {
  it('muestra el nombre de la app', async () => {
    await render(<Inicio />);
    expect(screen.getByText('vianda')).toBeOnTheScreen();
  });
});
