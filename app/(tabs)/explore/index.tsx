import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Region } from "react-native-maps";

// Replace the coordinates below with the real ones from your geocoding script
const CHECKPOINTS = [
  [
    {
      id: 8,
      title: "Christine Rathke Memorial Park",
      description: "Checkpoint at Christine Rathke Memorial Park",
      latitude: 42.9048859,
      longitude: -87.9991775,
    },
    {
      id: 11,
      title: "Dr. Lynette Fox Memorial Park",
      description: "Checkpoint at Dr. Lynette Fox Memorial Park",
      latitude: 42.920164,
      longitude: -87.98419799999999,
    },
    {
      id: 1,
      title: "Franklin Woods Nature Center w/ Kayla’s Playground",
      description:
        "Checkpoint at Franklin Woods Nature Center w/ Kayla’s Playground",
      latitude: 42.8860335,
      longitude: -87.9633559,
    },
    {
      id: 13,
      title: "Friendship Park",
      description: "Checkpoint at Friendship Park",
      latitude: 42.8935091,
      longitude: -87.9644141,
    },
    {
      id: 14,
      title: "Glenn Meadows Park",
      description: "Checkpoint at Glenn Meadows Park",
      latitude: 42.9113293,
      longitude: -87.9628606,
    },
    {
      id: 5,
      title: "Pleasant View Park",
      description: "Checkpoint at Pleasant View Park",
      latitude: 42.9041809,
      longitude: -87.9743264,
    },
    {
      id: 6,
      title: "Lions Legend Park II ilion",
      description: "Checkpoint at Lions Legend Park II ilion",
      latitude: 42.9003799,
      longitude: -88.0234311,
    },
    {
      id: 3,
      title: "Lions Legend Park I",
      description: "Checkpoint at Lions Legend Park I",
      latitude: 42.8987739,
      longitude: -88.0270523,
    },
    {
      id: 2,
      title: "Ken Windl Park",
      description: "Checkpoint at Ken Windl Park",
      latitude: 42.9159423,
      longitude: -88.0590675,
    },
    {
      id: 15,
      title: "Jack E. Workman Park",
      description: "Checkpoint at Jack E. Workman Park",
      latitude: 42.8970844,
      longitude: -87.9642978,
    },
  ],
];

export default function ExploreScreen() {
  const [region, setRegion] = useState<Region | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView style={styles.map} region={region} showsUserLocation={true}>
        {CHECKPOINTS[0].map((checkpoint) => (
          <Marker
            key={checkpoint.id}
            coordinate={{
              latitude: checkpoint.latitude,
              longitude: checkpoint.longitude,
            }}
            title={checkpoint.title}
            description={checkpoint.description}
          />
        ))}
      </MapView>
      <View style={styles.header}>
        <Text style={{ fontSize: 24 }}>Explore Screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 8,
  },
});
