import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Inicio() {
  return (
    <SafeAreaView style={estilos.contenedor}>
      <Text style={estilos.titulo}>vianda</Text>
      <Text style={estilos.texto}>Qué me toca, calculadora y marcar lo comido.</Text>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EEF3F8',
    padding: 16,
  },
  titulo: {
    color: '#12355B',
    fontSize: 32,
    fontWeight: '700',
  },
  texto: {
    color: '#12355B',
    marginTop: 8,
  },
});
