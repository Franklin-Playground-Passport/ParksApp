import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function LoginScreen() {
  const router = useRouter();

  const handleLogin = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/park-background.jpeg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <Text style={styles.title}>Parks Explorer</Text>
          <Text style={styles.subtitle}>
            Discover nature&apos;s hidden gems
          </Text>

          <Button
            mode="contained"
            icon={({ size }) => (
              <Ionicons name="logo-google" size={size} color="#fff" />
            )}
            onPress={handleLogin}
            style={styles.googleButton}
          >
            Sign in with Google
          </Button>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(18, 64, 38, 0.65)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#E0E0E0",
    marginBottom: 40,
    textAlign: "center",
  },
  googleButton: {
    width: 240,
    height: 48,
    marginVertical: 20,
    backgroundColor: "#4285F4",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    alignItems: "center",
  },
  footerText: {
    color: "#CCCCCC",
    fontSize: 12,
    textAlign: "center",
  },
});
