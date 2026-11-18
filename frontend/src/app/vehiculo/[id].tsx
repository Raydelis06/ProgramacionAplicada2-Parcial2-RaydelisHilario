import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { comprar, getVehiculo, mensaje, Vehiculo } from '../../services/api';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';


export default function Detalle() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const cargar = () => getVehiculo(id).then(setVehiculo).catch((e) => setError(mensaje(e)));
  useEffect(() => { cargar(); }, []);

  function confirmar() {
    if (!vehiculo) return;
    Alert.alert('Confirmar compra', `¿Comprar ${vehiculo.marca} ${vehiculo.modelo} por US$ ${Number(vehiculo.precio).toLocaleString()}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Comprar', onPress: hacerCompra },
    ]);
  }

  async function hacerCompra() {
    try {
      setError('');
      await comprar(Number(id));
      setExito('¡Compra realizada con éxito!');
      cargar();
    } catch (e) {
      setError(mensaje(e));
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {exito ? <Text style={styles.ok}>{exito}</Text> : null}
      {vehiculo && (
        <>
          <ThemedText type='title'>{vehiculo.marca} {vehiculo.modelo}</ThemedText>
          <ThemedText type='default'>Año: {vehiculo.anio}</ThemedText>
          <Text style={styles.cardDesc}>Precio: US$ {Number(vehiculo.precio).toLocaleString()}</Text>
          <Text style={styles.cardDesc}>Estado: {vehiculo.estado}</Text>
          {vehiculo.estado === 'disponible' && (
            <TouchableOpacity style={styles.button} onPress={confirmar}>
              <Text style={styles.buttonText}>Comprar</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  screen: { 
    padding: 20, 
    gap: 10 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    marginBottom: 10, 
    color: 'white'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: 'gray', 
    padding: 14, 
    borderRadius: 8, 
    alignItems: 'center' 
  },
  buttonText: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 16
  },
  link: { 
    color: 'gray', 
    fontSize: 16, 
    padding: 6 
  },
  card: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    padding: 14 
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: 'bold' ,
    color:'white'
  },
  cardDesc: { 
    fontSize: 12, 
    color:'white'
  },
  error: { 
    color: '#c62828', 
    backgroundColor: '#fdecea', 
    padding: 10, 
    borderRadius: 8 },
  ok: { 
    color: '#1b5e20', 
    backgroundColor: '#e8f5e9', 
    padding: 10, 
    borderRadius: 8 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
});