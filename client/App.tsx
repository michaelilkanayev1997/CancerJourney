import LottieAnimation from "@components/LottieAnimation";
import SignUp from "@views/auth/SignUp";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <LottieAnimation />
      <SignUp />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
