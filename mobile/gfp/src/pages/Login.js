import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>
      <Button
        title="Entrar"
        onPress={() => navigation.navigate("MenuDrawer")}
        color="#4CAF50"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa toda a tela
    justifyContent: "center", // Centraliza verticalmente
    alignItems: "center", // Centraliza horizontalmente
    backgroundColor: "#f0f0f0", // Cor de fundo suave
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
});