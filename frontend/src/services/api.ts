import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { jwtDecode } from "jwt-decode";

let authToken: string | null = null;
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export type Vehiculo = {
  id: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  estado: string;
};

export type Venta = {
  id: number;
  fecha?: string;
  createdAt?: string;
  monto?: number;
  total?: number;
  marca?: string;
  modelo?: string;
  vehiculo?: { marca?: string; modelo?: string; precio?: number };
};

export const getToken = () => AsyncStorage.getItem('token');
export const logout = () => AsyncStorage.removeItem('token');

export const mensaje = (e: unknown) => (e instanceof Error ? e.message : 'Ocurrió un error');

async function request(path: string, method = 'GET', body?: object) {
  const token = await getToken();
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || data?.error || `Error ${res.status}`);
  return data;
}

const lista = (d: any) => (Array.isArray(d) ? d : d?.data ?? []);

//AUTH
export async function login(email: string, password: string) {
  const d = await request('/auth/login', 'POST', { email, password });
  await AsyncStorage.setItem('token', d.token);
}

export async function registro(nombre: string, email: string, password: string) {
  await request('/auth/registro', 'POST', { nombre, email, password });
  await login(email, password);
}

//VEHICULOS
export async function getVehiculos(soloDisponibles: boolean): Promise<Vehiculo[]> {
  return lista(
    await request('/vehiculos' + (soloDisponibles ? '?estado=disponible' : ''))
  );
}

export async function getVehiculo(id: string): Promise<Vehiculo> {
  const d = await request('/vehiculos/' + id);
  return d?.data ?? d;
}

//VENTAS
export const comprar = (vehiculoId: number) =>
  request('/ventas', 'POST', { vehiculoId, metodoPago: 'transferencia' });

export async function getCompras(): Promise<Venta[]> {
  return lista(
    await request('/ventas')
  );
}