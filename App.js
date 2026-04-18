import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {

  const [contador, setContador] = useState(0); //declara el contador

  useEffect(() => {
    const cargarContador = async () => {
      try {
        const data = await AsyncStorage.getItem("contador");
        if (data !== null) {
          setContador(JSON.parse(data));
        }
      } catch (e) {
        console.log("Error cargando");
      }
    };
    cargarContador();
  }, [contador]);

  const incrementar = async (valor) => {
    try {
      await AsyncStorage.setItem("contador", JSON.stringify(contador+1));
      setContador(contador+1);
    } catch (e) {
      console.log("Error guardando");
    }
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Tu contador ha aumentado",
        body: `Valor actual: ${contador}!`,
      },
      trigger: { seconds: 1 }, 
    });
  };

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const pedirPermiso = async () => {
    await Notifications.requestPermissionsAsync();
  };

  const enviarNotificacion = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Hola, mundo 🌍",
        body: "Esta es tu primera notificación",
      },
    });
  };

  return (
    <View style={[styles.container, { marginTop: 50 }]}>
      <Text>Notificaciones</Text>

      <Button title="Pedir permiso" onPress={pedirPermiso} />
      <Button title="Enviar notificación" onPress={enviarNotificacion} />

      <Text style={{ fontSize: 20 }}>Contador: {contador}</Text>
      <Button title="Incrementar" onPress={incrementar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
