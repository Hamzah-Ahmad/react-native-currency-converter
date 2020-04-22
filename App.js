import React from "react";
import { StyleSheet, Text, View } from "react-native";

//Import Components
import Homepage from "./components/Homepage";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Curency Converter</Text>
      <Homepage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b416a",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
    fontSize: 25,
    marginBottom: 40,
  },
});
