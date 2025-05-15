import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <Text style={{ fontSize: 28, marginBottom: 16 }}>
        Welcome to ParksApp!
      </Text>
      <Text style={{ fontSize: 16, marginBottom: 32, textAlign: "center" }}>
        Discover and explore parks near you.
      </Text>
      <Button
        mode="contained"
        onPress={() => router.replace("/(tabs)/home")}
        buttonColor="blue"
      >
        Get Started
      </Button>
    </View>
  );
}
