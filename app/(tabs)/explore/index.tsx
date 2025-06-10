import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraView } from "expo-camera";
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

interface Checkpoint {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  qrCode: string;
}

interface QuizQuestion {
  question: string;
  options?: string[];
  type?: "text" | "multiple-choice";
}

interface ParkVisit {
  parkId: number;
  visitDate: Date;
  quizResponses: Record<number, string>;
  completed: boolean;
}

// Data
const CHECKPOINTS: Checkpoint[] = [
  {
    id: 8,
    title: "Christine Rathke Memorial Park",
    description: "Checkpoint at Christine Rathke Memorial Park",
    latitude: 42.9048859,
    longitude: -87.9991775,
    qrCode: "CRMP_2024_001",
  },
  {
    id: 11,
    title: "Dr. Lynette Fox Memorial Park",
    description: "Checkpoint at Dr. Lynette Fox Memorial Park",
    latitude: 42.920164,
    longitude: -87.98419799999999,
    qrCode: "DLFMP_2024_002",
  },
  {
    id: 1,
    title: "Franklin Woods Nature Center w/ Kayla's Playground",
    description:
      "Checkpoint at Franklin Woods Nature Center w/ Kayla's Playground",
    latitude: 42.8860335,
    longitude: -87.9633559,
    qrCode: "FWNC_2024_003",
  },
  {
    id: 13,
    title: "Friendship Park",
    description: "Checkpoint at Friendship Park",
    latitude: 42.8935091,
    longitude: -87.9644141,
    qrCode: "FP_2024_004",
  },
  {
    id: 14,
    title: "Glenn Meadows Park",
    description: "Checkpoint at Glenn Meadows Park",
    latitude: 42.9113293,
    longitude: -87.9628606,
    qrCode: "GMP_2024_005",
  },
  {
    id: 5,
    title: "Pleasant View Park",
    description: "Checkpoint at Pleasant View Park",
    latitude: 42.9041809,
    longitude: -87.9743264,
    qrCode: "PVP_2024_006",
  },
  {
    id: 6,
    title: "Lions Legend Park II",
    description: "Checkpoint at Lions Legend Park II",
    latitude: 42.9003799,
    longitude: -88.0234311,
    qrCode: "LLP2_2024_007",
  },
  {
    id: 3,
    title: "Lions Legend Park I",
    description: "Checkpoint at Lions Legend Park I",
    latitude: 42.8987739,
    longitude: -88.0270523,
    qrCode: "LLP1_2024_008",
  },
  {
    id: 2,
    title: "Ken Windl Park",
    description: "Checkpoint at Ken Windl Park",
    latitude: 42.9159423,
    longitude: -88.0590675,
    qrCode: "KWP_2024_009",
  },
  {
    id: 15,
    title: "Jack E. Workman Park",
    description: "Checkpoint at Jack E. Workman Park",
    latitude: 42.8970844,
    longitude: -87.9642978,
    qrCode: "JEWP_2024_010",
  },
];

const PARK_QUESTIONNAIRES: Record<number | string, QuizQuestion[]> = {
  8: [
    {
      question: "How many benches are in Christine Rathke Memorial Park?",
      options: ["4", "6", "8", "10"],
      type: "multiple-choice",
    },
    {
      question: "What color are the play structures?",
      options: [
        "Blue and Yellow",
        "Red and Green",
        "Purple and Orange",
        "Black and White",
      ],
      type: "multiple-choice",
    },
    {
      question: "What wildlife did you observe in the park?",
      type: "text",
    },
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
      type: "multiple-choice",
    },
    { question: "What did you learn about Dr. Lynette Fox?", type: "text" },
    { question: "What was your favorite part of the park?", type: "text" },
  ],
  1: [
    {
      question: "What kind of trees are in Franklin Woods Nature Center?",
      options: ["Pine", "Oak", "Maple", "All of the above"],
      type: "multiple-choice",
    },
    {
      question: "Did you see any wildlife in the woods?",
      options: ["Yes", "No"],
      type: "multiple-choice",
    },
    {
      question:
        "What was your favorite playground equipment at Kayla's Playground?",
      type: "text",
    },
  ],
  default: [
    { question: "What did you like most about this park?", type: "text" },
    { question: "What could be improved at this park?", type: "text" },
    {
      question: "How would you rate this park?",
      options: ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"],
      type: "multiple-choice",
    },
  ],
};

// Local storage utilities (replace with Firebase later)
class LocalParkDataManager {
  private static STORAGE_KEY = "park_visits";

  static async saveVisit(visit: ParkVisit): Promise<void> {
    try {
      const visits = await this.getAllVisits();
      const existingIndex = visits.findIndex((v) => v.parkId === visit.parkId);

      if (existingIndex >= 0) {
        visits[existingIndex] = visit;
      } else {
        visits.push(visit);
      }

      // In a real app, this would be localStorage.setItem or AsyncStorage
      console.log("Saving visit:", visit);
      // TODO: Replace with Firebase Firestore
    } catch (error) {
      console.error("Error saving visit:", error);
    }
  }

  static async getAllVisits(): Promise<ParkVisit[]> {
    try {
      // In a real app, this would be localStorage.getItem or AsyncStorage
      // TODO: Replace with Firebase Firestore query
      return []; // Temporary empty array
    } catch (error) {
      console.error("Error getting visits:", error);
      return [];
    }
  }

  static async getVisitedParkIds(): Promise<number[]> {
    const visits = await this.getAllVisits();
    return visits
      .filter((visit) => visit.completed)
      .map((visit) => visit.parkId);
  }
}

export default function ExploreScreen() {
  const [region, setRegion] = useState<Region | null>(null);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [scannedParkId, setScannedParkId] = useState<number | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [visitedParks, setVisitedParks] = useState<number[]>([]);
  const [isProgressCollapsed, setIsProgressCollapsed] = useState(false);
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  const progressHeight = useRef(new Animated.Value(1)).current;

  const scannedPark = scannedParkId
    ? CHECKPOINTS.find((park) => park.id === scannedParkId)
    : null;

  const questionnaire = scannedParkId
    ? PARK_QUESTIONNAIRES[scannedParkId] || PARK_QUESTIONNAIRES.default
    : [];

  useEffect(() => {
    initializeLocation();
    loadVisitedParks();
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const loadVisitedParks = async () => {
    try {
      const visitedParkIds = await LocalParkDataManager.getVisitedParkIds();
      setVisitedParks(visitedParkIds);
    } catch (error) {
      console.error("Error loading visited parks:", error);
    }
  };

  // Simulate QR code scanning (replace with actual QR scanner later)
  const handleSimulateScan = (parkId: number) => {
    const park = CHECKPOINTS.find((p) => p.id === parkId);
    if (!park) return;

    // Check if already visited
    if (visitedParks.includes(parkId)) {
      alert("You've already completed the quiz for this park!");
      return;
    }

    setScannedParkId(parkId);
    setScannerOpen(false);
    setShowQuestionnaire(true);
    setResponses({});
  };

  // Handle actual QR code scan (implement when ready)
  const handleQRCodeScan = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true);
    const park = CHECKPOINTS.find((p) => p.qrCode === data);

    if (park) {
      if (visitedParks.includes(park.id)) {
        alert("You've already completed the quiz for this park!");
        setScannerOpen(false);
        setScanned(false);
        return;
      }

      setScannedParkId(park.id);
      setScannerOpen(false);
      setShowQuestionnaire(true);
      setResponses({});
      setScanned(false);
    } else {
      alert(
        "Invalid QR code. This doesn't appear to be from a participating park."
      );
      setScanned(false);
    }
  };

  const openScanner = () => {
    if (hasPermission === null) {
      alert("Requesting camera permission...");
      getCameraPermissions();
      return;
    }
    if (hasPermission === false) {
      alert("Camera permission is required to scan QR codes.");
      return;
    }
    setScannerOpen(true);
    setScanned(false);
  };

  const handleResponseChange = (questionIndex: number, answer: string) => {
    setResponses((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const handleSubmitQuestionnaire = async () => {
    if (!scannedParkId) return;

    // Validate that all questions are answered
    const unansweredQuestions = questionnaire.filter(
      (_, index) => !responses[index]
    );
    if (unansweredQuestions.length > 0) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      // Create visit record
      const visit: ParkVisit = {
        parkId: scannedParkId,
        visitDate: new Date(),
        quizResponses: responses,
        completed: true,
      };

      // Save to local storage (will be Firebase later)
      await LocalParkDataManager.saveVisit(visit);

      // Update local state
      setVisitedParks((prev) => [...prev, scannedParkId]);

      alert(
        "Congratulations! You've successfully completed this park's challenge!"
      );
      setShowQuestionnaire(false);
      setScannedParkId(null);
      setResponses({});

      // TODO: Add navigation to profile or achievement screen
      // router.push('/(tabs)/profile');
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("There was an error saving your progress. Please try again.");
    }
  };

  // Calculate progress
  const totalParks = CHECKPOINTS.length;
  const completedParks = visitedParks.length;
  const progressPercentage = totalParks > 0 ? completedParks / totalParks : 0;

  const toggleProgressSection = () => {
    Animated.timing(progressHeight, {
      toValue: isProgressCollapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    setIsProgressCollapsed(!isProgressCollapsed);
  };

  const mapHeightInterpolation = progressHeight.interpolate({
    inputRange: [0, 1],
    outputRange: ["100%", "60%"],
  });

  const progressMaxHeight = progressHeight.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 500],
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

      {/* Map Section */}
      <Animated.View
        style={[styles.mapContainer, { height: mapHeightInterpolation }]}
      >
        <MapView style={styles.map} region={region} showsUserLocation={true}>
          {CHECKPOINTS.map((checkpoint) => (
            <Marker
              key={checkpoint.id}
              coordinate={{
                latitude: checkpoint.latitude,
                longitude: checkpoint.longitude,
              }}
              title={checkpoint.title}
              description={`${checkpoint.description} ${
                visitedParks.includes(checkpoint.id)
                  ? "✅ Completed"
                  : "📍 Visit to unlock quiz"
              }`}
              pinColor={
                visitedParks.includes(checkpoint.id) ? "#4CAF50" : "#FF5722"
              }
              onPress={() => handleSimulateScan(checkpoint.id)}
            />
          ))}
        </MapView>
      </Animated.View>

      {/* Progress Section */}
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

      {/* Collapsed toggle button */}
      {isProgressCollapsed && (
        <TouchableOpacity
          style={styles.collapsedToggleButton}
          onPress={toggleProgressSection}
        >
          <Ionicons name="chevron-up" size={20} color="#4CAF50" />
          <Text style={styles.collapsedToggleText}>Show Progress</Text>
        </TouchableOpacity>
      )}

      {/* Scan QR Button */}
      {isProgressCollapsed && (
        <TouchableOpacity style={styles.scanButton} onPress={openScanner}>
          <Ionicons name="qr-code" size={28} color="white" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      )}

      {/* QR Scanner Modal */}
      <Modal
        visible={isScannerOpen}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setScannerOpen(false)}
      >
        <View style={styles.scannerModalContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setScannerOpen(false)}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Scan Park QR Code</Text>
            <View style={{ width: 24 }} />
          </View>

          {hasPermission === null ? (
            <View style={styles.permissionContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.permissionText}>
                Requesting camera permission...
              </Text>
            </View>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-outline" size={64} color="#757575" />
              <Text style={styles.permissionText}>
                Camera permission is required
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={getCameraPermissions}
              >
                <Text style={styles.permissionButtonText}>
                  Grant Permission
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cameraContainer}>
              <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleQRCodeScan}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
              >
                <View style={styles.scannerOverlay}>
                  <View style={styles.scannerFrame} />
                  <Text style={styles.scannerInstructions}>
                    Position the QR code within the frame
                  </Text>
                </View>
              </CameraView>
            </View>
          )}

          {/* Fallback demonstration section */}
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackTitle}>For Testing:</Text>
            <ScrollView
              style={styles.fallbackList}
              showsVerticalScrollIndicator={false}
            >
              {CHECKPOINTS.slice(0, 3).map((park) => (
                <TouchableOpacity
                  key={park.id}
                  style={[
                    styles.fallbackItem,
                    visitedParks.includes(park.id) &&
                      styles.fallbackItemVisited,
                  ]}
                  onPress={() => handleSimulateScan(park.id)}
                  disabled={visitedParks.includes(park.id)}
                >
                  <Text style={styles.fallbackParkName}>{park.title}</Text>
                  <Text style={styles.fallbackQRCode}>QR: {park.qrCode}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Quiz Modal */}
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
                Welcome to {scannedPark?.title}! Please answer these questions
                about your experience:
              </Text>

              {questionnaire.map((item, index) => (
                <Card key={index} style={styles.questionCard}>
                  <Card.Content>
                    <Text style={styles.questionText}>
                      {index + 1}. {item.question}
                    </Text>

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
                        multiline
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
                disabled={questionnaire.some((_, index) => !responses[index])}
              >
                Complete Park Visit
              </Button>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Add these new styles to your existing StyleSheet
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
    paddingBottom: 80,
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
    marginTop: 20,
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
  scannerModalContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scannerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  backButton: {
    padding: 8,
  },
  scannerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  cameraContainer: {
    flex: 2,
  },
  camera: {
    flex: 1,
  },
  scannerOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 3,
    borderColor: "#4CAF50",
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  scannerInstructions: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  fallbackContainer: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  fallbackList: {
    flex: 1,
  },
  fallbackItem: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  fallbackItemVisited: {
    backgroundColor: "#E8F5E9",
    opacity: 0.7,
  },
  fallbackParkName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  fallbackQRCode: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
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
});
