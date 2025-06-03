import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import { Button, Card, ProgressBar, TextInput } from "react-native-paper";

// Define a type for your checkpoint objects
interface Checkpoint {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
}

// Properly declare CHECKPOINTS with its type
const CHECKPOINTS: Checkpoint[][] = [
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
      title: "Franklin Woods Nature Center w/ Kayla's Playground",
      description:
        "Checkpoint at Franklin Woods Nature Center w/ Kayla's Playground",
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

// Sample questionnaires for different parks
const PARK_QUESTIONNAIRES = {
  8: [
    {
      question: "How many benches are in Christine Rathke Memorial Park?",
      options: ["4", "6", "8", "10"],
    },
    {
      question: "What color are the play structures?",
      options: [
        "Blue and Yellow",
        "Red and Green",
        "Purple and Orange",
        "Black and White",
      ],
    },
    { question: "What wildlife did you observe in the park?", type: "text" },
  ],
  11: [
    {
      question: "What is special about Dr. Lynette Fox Memorial Park?",
      options: [
        "It has a fountain",
        "It has a statue",
        "It has a garden",
        "All of the above",
      ],
    },
    { question: "What did you learn about Dr. Lynette Fox?", type: "text" },
    { question: "What was your favorite part of the park?", type: "text" },
  ],
  1: [
    {
      question: "What kind of trees are in Franklin Woods Nature Center?",
      options: ["Pine", "Oak", "Maple", "All of the above"],
    },
    {
      question: "Did you see any wildlife in the woods?",
      options: ["Yes", "No"],
    },
    {
      question:
        "What was your favorite playground equipment at Kayla's Playground?",
      type: "text",
    },
  ],
  // Default questionnaire for parks without specific questions
  default: [
    { question: "What did you like most about this park?", type: "text" },
    { question: "What could be improved at this park?", type: "text" },
    {
      question: "How would you rate this park?",
      options: ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
    },
  ],
};

export default function ExploreScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [scannedParkId, setScannedParkId] = useState<number | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [visitedParks, setVisitedParks] = useState<number[]>([]);
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false);

  const progressHeight = useRef(new Animated.Value(1)).current;

  type ResponsesType = Record<number, string>;

  const [responses, setResponses] = useState<ResponsesType>({});

  const scannedPark = scannedParkId
    ? CHECKPOINTS[0].find((park) => park.id === scannedParkId)
    : null;

  const questionnaire = scannedParkId
    ? PARK_QUESTIONNAIRES[scannedParkId as keyof typeof PARK_QUESTIONNAIRES] ||
      PARK_QUESTIONNAIRES.default
    : [];

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

  // Simulate scanning a QR code by selecting a park
  const handleSimulateScan = (parkId: number) => {
    setScannedParkId(parkId);
    setScannerOpen(false);
    setShowQuestionnaire(true);
    // Reset responses for the new park
    setResponses({});
  };

  const handleResponseChange = (questionIndex: number, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuestionnaire = () => {
    // In a real app, you would save the responses to a database or API
    console.log("Submitted answers for park ID:", scannedParkId, responses);

    // Add the park to visited parks if not already there
    if (scannedParkId && !visitedParks.includes(scannedParkId)) {
      setVisitedParks((prev) => [...prev, scannedParkId]);
    }

    alert("Thank you for completing the questionnaire!");
    setShowQuestionnaire(false);
  };

  // Calculate progress
  const totalParks = CHECKPOINTS[0].length;
  const completedParks = visitedParks.length;
  const progressPercentage = totalParks > 0 ? completedParks / totalParks : 0;

  // Toggle progress section with animation
  const toggleProgressSection = () => {
    // Start animation
    Animated.timing(progressHeight, {
      toValue: isProgressCollapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    // Update state after animation starts
    setIsProgressCollapsed(!isProgressCollapsed);
  };

  // Interpolate height for the map container
  const mapHeightInterpolation = progressHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "60%"],
  });

  // Instead of directly animating flex or height with "auto",
  // use maxHeight and opacity for a similar effect
  const progressMaxHeight = progressHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500], // Use a large enough value instead of "auto"
  });

  const progressOpacity = progressHeight.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 1],
  });

  if (!region) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Park Explorer</Text>
      </View>

      {/* Map Section - Dynamic height based on animation */}
      <Animated.View
        style={[styles.mapContainer, { height: mapHeightInterpolation }]}
      >
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
              pinColor={
                visitedParks.includes(checkpoint.id) ? "#4CAF50" : "#FF5722"
              }
              onPress={() => handleSimulateScan(checkpoint.id)}
            />
          ))}
        </MapView>
      </Animated.View>

      {/* Progress Section - Animated height */}
      <Animated.View
        style={[
          styles.progressContainer,
          {
            maxHeight: progressMaxHeight,
            opacity: progressOpacity,
            overflow: "hidden",
          },
        ]}
      >
        <TouchableOpacity
          style={styles.toggleProgressButtonTop}
          onPress={toggleProgressSection}
        >
          <Ionicons
            name={isProgressCollapsed ? "chevron-up" : "chevron-down"}
            size={20}
            color="#4CAF50"
          />
          <Text style={styles.toggleProgressTextTop}>
            {isProgressCollapsed ? "Show Progress" : "Hide Progress"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.progressTitle}>Your Explorer Progress</Text>

        <View style={styles.progressBarContainer}>
          <ProgressBar
            progress={progressPercentage}
            color="#4CAF50"
            style={styles.progressBar}
          />
          <Text style={styles.progressText}>
            {completedParks} of {totalParks} parks explored (
            {Math.round(progressPercentage * 100)}%)
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <View style={[styles.statBadge, { backgroundColor: "#E8F5E9" }]}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.statNumber}>{completedParks}</Text>
            </View>
            <Text style={styles.statLabel}>Visited</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statBadge, { backgroundColor: "#FFF3E0" }]}>
              <Ionicons name="map" size={24} color="#FF9800" />
              <Text style={styles.statNumber}>
                {totalParks - completedParks}
              </Text>
            </View>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>

          <View style={styles.statItem}>
            <View style={[styles.statBadge, { backgroundColor: "#E3F2FD" }]}>
              <Ionicons name="trophy" size={24} color="#1976D2" />
              <Text style={styles.statNumber}>
                {completedParks >= totalParks
                  ? "🌟"
                  : Math.round(progressPercentage * 100) + "%"}
              </Text>
            </View>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
      </Animated.View>

      {isProgressCollapsed && (
        <TouchableOpacity
          style={styles.collapsedToggleButton}
          onPress={toggleProgressSection}
        >
          <Ionicons name="chevron-up" size={20} color="#4CAF50" />
          <Text style={styles.collapsedToggleText}>Show Progress</Text>
        </TouchableOpacity>
      )}

      {/* Scan QR Button - Only show when progress is collapsed */}
      {isProgressCollapsed && (
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => setScannerOpen(true)}
        >
          <Ionicons name="qr-code" size={28} color="white" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={isScannerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setScannerOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Scan Park QR Code</Text>
              <TouchableOpacity onPress={() => setScannerOpen(false)}>
                <Ionicons name="close" size={24} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            <View style={styles.scannerPlaceholder}>
              <Ionicons name="scan-outline" size={100} color="#2E7D32" />
              <Text style={styles.scannerText}>
                Position the QR code within the frame to scan
              </Text>
            </View>

            <Text style={styles.simulateText}>For demonstration purposes:</Text>
            <ScrollView style={styles.parkList}>
              {CHECKPOINTS[0].map((park) => (
                <TouchableOpacity
                  key={park.id}
                  style={styles.parkItem}
                  onPress={() => handleSimulateScan(park.id)}
                >
                  <Text style={styles.parkItemTitle}>{park.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#757575" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Questionnaire Modal */}
      <Modal
        visible={showQuestionnaire}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowQuestionnaire(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{scannedPark?.title}</Text>
              <TouchableOpacity onPress={() => setShowQuestionnaire(false)}>
                <Ionicons name="close" size={24} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.questionnaireContainer}>
              <Text style={styles.questionnaireDescription}>
                Please answer these questions about your experience at this
                park:
              </Text>

              {questionnaire.map((item, index) => (
                <Card key={index} style={styles.questionCard}>
                  <Card.Content>
                    <Text style={styles.questionText}>{item.question}</Text>

                    {item.type === "text" ? (
                      <TextInput
                        mode="outlined"
                        outlineColor="#4CAF50"
                        activeOutlineColor="#2E7D32"
                        placeholder="Your answer"
                        style={styles.textInput}
                        value={responses[index] || ""}
                        onChangeText={(text) =>
                          handleResponseChange(index, text)
                        }
                      />
                    ) : item.options ? (
                      <View style={styles.optionsContainer}>
                        {item.options.map((option, optionIndex) => (
                          <TouchableOpacity
                            key={optionIndex}
                            style={[
                              styles.optionButton,
                              responses[index] === option &&
                                styles.selectedOption,
                            ]}
                            onPress={() => handleResponseChange(index, option)}
                          >
                            <Text
                              style={[
                                styles.optionText,
                                responses[index] === option &&
                                  styles.selectedOptionText,
                              ]}
                            >
                              {option}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    ) : null}
                  </Card.Content>
                </Card>
              ))}

              <Button
                mode="contained"
                style={styles.submitButton}
                buttonColor="#4CAF50"
                onPress={handleSubmitQuestionnaire}
              >
                Submit Answers
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    position: "absolute",
    top: 40,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
    zIndex: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  mapContainer: {
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: "hidden",
    elevation: 3,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  progressContainer: {
    overflow: "hidden",
    padding: 16,
    paddingBottom: 80, // Space for the scan button
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  progressText: {
    color: "#616161",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    marginTop: 20, // Add margin to move bubbles down
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statNumber: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 2,
  },
  statLabel: {
    color: "#757575",
    fontSize: 13,
  },
  recentActivity: {
    flexGrow: 0,
  },
  recentCard: {
    width: 150,
    marginRight: 12,
    borderRadius: 10,
    elevation: 2,
  },
  recentParkName: {
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: 4,
  },
  recentTime: {
    color: "#9E9E9E",
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: "#ECEFF1",
    width: 200,
  },
  emptyCardContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  emptyCardText: {
    color: "#757575",
    marginTop: 8,
    textAlign: "center",
  },
  scanButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 4,
  },
  scanButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  toggleProgressButtonTop: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    marginBottom: 12,
    elevation: 1,
  },
  toggleProgressTextTop: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
    flex: 1,
  },
  scannerPlaceholder: {
    height: 250,
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  scannerText: {
    margin: 20,
    textAlign: "center",
    color: "#757575",
  },
  simulateText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  parkList: {
    flex: 1,
  },
  parkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  parkItemTitle: {
    fontSize: 16,
  },
  questionnaireContainer: {
    flex: 1,
  },
  questionnaireDescription: {
    fontSize: 16,
    marginBottom: 20,
    color: "#616161",
  },
  questionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "white",
    marginTop: 8,
  },
  optionsContainer: {
    marginTop: 8,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#4CAF50",
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: "#E8F5E9",
    borderColor: "#2E7D32",
  },
  optionText: {
    color: "#2E7D32",
  },
  selectedOptionText: {
    fontWeight: "bold",
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 40,
    borderRadius: 8,
  },
  collapsedToggleButton: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(232, 245, 233, 0.95)",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  collapsedToggleText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 12,
    marginLeft: 4,
  },
});
