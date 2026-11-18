import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getToken, getVehiculos, logout, mensaje, Vehiculo } from '../../services/api';
import { StyleSheet } from 'react-native';

export default function Catalogo() {
  const router = useRouter();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [error, setError] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        if (!(await getToken())) return router.replace('/');
        try {
          setError('');
          setVehiculos(await getVehiculos(soloDisponibles));
        } catch (e) {
          setError(mensaje(e));
        }
      })();
    }, [soloDisponibles]),
  );

  async function salir() {
    await logout();
    router.push("/registro");
  }

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={salir}><Text style={styles.buttonText}>Cerrar sesión</Text></TouchableOpacity>
      </View>

      <Pressable onPress={() => setSoloDisponibles(!soloDisponibles)}>
        <Text style={styles.link}>{soloDisponibles ? 'Solo disponibles (tocar para ver todos)' : 'Ver solo disponibles'}</Text>
      </Pressable>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {vehiculos.map((vehiculo) => (
        <Pressable key={vehiculo.id} style={styles.card} onPress={() => router.push(`/vehiculo/${vehiculo.id}`)}>
          <Text style={styles.cardTitle}>{vehiculo.marca} {vehiculo.modelo}</Text>
          <Text style={styles.cardDesc}>Año: {vehiculo.anio}</Text>
          <Text style={styles.cardDesc}>Precio: US$ {Number(vehiculo.precio).toLocaleString()}</Text>
          <Text style={styles.cardDesc}>Estado: {vehiculo.estado}</Text>
        </Pressable>
      ))}
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
    marginBottom: 10 ,
    color:'white'
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
    color: 'white', 
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
    color: 'gray', 
    backgroundColor: '#fdecea', 
    padding: 10, 
    borderRadius: 8 },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
});

