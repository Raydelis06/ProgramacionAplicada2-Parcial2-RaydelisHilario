import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getCompras, mensaje, Venta } from '../../services/api';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

export default function Compras() {
  const [compras, setCompras] = useState<Venta[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getCompras().then(setCompras).catch((e) => setError(mensaje(e)));
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && compras.length === 0 && <Text>Aún no has hecho compras.</Text>}
      {compras.map((compra, i) => {
        const marca = compra.vehiculo?.marca ?? compra.marca;
        const modelo = compra.vehiculo?.modelo ?? compra.modelo;
        const monto = compra.monto ?? compra.total ?? compra.vehiculo?.precio;
        const fecha = compra.fecha ?? compra.createdAt;
        return (
          <>
          <View style={styles.screen}>
            <Text style={styles.title}>Mis compras</Text>
          </View>
          <View key={compra.id ?? i} style={styles.card}>
            <Text style={styles.cardTitle}>{marca} {modelo}</Text>
            <Text style={styles.cardDesc}>Fecha: {fecha ? new Date(fecha).toLocaleDateString() : '—'}</Text>
            <Text style={styles.cardDesc}>Monto: US$ {monto != null ? Number(monto).toLocaleString() : '—'}</Text>
          </View>
          </>
        );
      })}
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
    color: 'white'
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
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
});
