import * as Device from 'expo-device';
import { ActivityIndicator, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { registro } from '@/services/api';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function RegistroScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegistrarse = async () => {
    if (!email.trim() || !password || !nombre) {
      setError("Escribe tu nombre, email y contraseña.");
      return;
    }

    setCargando(true);
    setError("");
    try {
      await registro(nombre, email.trim(), password);
      console.log("Se ha registrado correctamente");
        router.replace("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo completar el registro.",
      );
    } finally {
      setCargando(false);
    }
  };

  const irlogin = () => {
    router.push("/");
  };

  return (
    
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <ThemedText type="title" style={styles.title}>
            VICECITY
          </ThemedText>
        </ThemedView>

        <ThemedText type="subtitle" style={styles.code}>
          Registro
        </ThemedText>
        <ThemedText type="default" style={styles.code}>
          Nombre
        </ThemedText>
        <TextInput 
            placeholder='Tu nombre completo' 
            placeholderTextColor={'gray'} 
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}></TextInput>
        <ThemedText type="default" style={styles.code}>
          Email
        </ThemedText>
        <TextInput 
            placeholder='ejemplo@email.com' 
            placeholderTextColor={'gray'} 
            style={styles.input}
            value={email}
            onChangeText={setEmail}></TextInput>
        <ThemedText type="default" style={styles.code}>
          Constraseña
        </ThemedText>
        <TextInput 
            placeholder='tuContraseña' 
            placeholderTextColor={'gray'} 
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry></TextInput>
        {error ? <ThemedText style={{color:'red'}}>{error}</ThemedText> : null}
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegistrarse}
          disabled={cargando}
        >
          <ThemedText>
            {cargando ? (
              <ActivityIndicator/>
            ) : (
              <ThemedText>Registrarse</ThemedText>
            )}
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity onPress={irlogin}>
          <ThemedText type='code'>Ya tienes una cuenta? Inicia sesion</ThemedText>
        </TouchableOpacity>
        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  input:{
    height: 46,
    borderWidth: 1,
    borderColor: "#ffffff8d",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    width:300,
    color: 'white'
  },
  button: {
    marginTop: 8,
    backgroundColor: 'gray',
    height: 46,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12
  },
});
