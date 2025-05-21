import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, ProgressBar } from "react-native-paper";

export default function HomeScreen() {
  const router = useRouter();

  const userData = {
    name: "John",
    completedParks: 4,
    totalParks: 10,
    daysRemaining: 45,
  };

  const featuredParks = [
    {
      id: 1,
      name: "Kayla's Playground",
      image: require("../../../assets/images/kaylas-playground.jpeg"),
      status: "Open",
      distance: "1.2 mi",
    },
    {
      id: 8,
      name: "Christine Rathke Memorial Park",
      image: require("../../../assets/images/memorial-park.jpg"),
      status: "Open",
      distance: "2.5 mi",
    },
    {
      id: 11,
      name: "Dr. Lynette Fox Memorial Park",
      image: require("../../../assets/images/lynette-fox.jpg"),
      status: "Open",
      distance: "3.7 mi",
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Kayla's Playground Reopened!",
      date: "July 1, 2025",
      content: "The renovations are complete! Come check out the new features.",
    },
    {
      id: 2,
      title: "Summer Challenge Ending Soon",
      date: "July 25, 2025",
      content:
        "Complete your passport by August 5th to enter the prize drawing!",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeBanner}>
        <View>
          <Text style={styles.welcomeText}>Welcome back, {userData.name}!</Text>
          <Text style={styles.welcomeSubtext}>
            Ready to explore more parks today?
          </Text>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => console.log("Notifications")}
        >
          <Ionicons name="notifications-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Your Passport Progress</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
              <Text style={styles.viewAll}>View Details</Text>
            </TouchableOpacity>
          </View>

          <ProgressBar
            progress={userData.completedParks / userData.totalParks}
            color="#4CAF50"
            style={styles.progressBar}
          />

          <View style={styles.progressStats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {userData.completedParks}/{userData.totalParks}
              </Text>
              <Text style={styles.statLabel}>Parks Visited</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{userData.daysRemaining}</Text>
              <Text style={styles.statLabel}>Days Left</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {userData.totalParks - userData.completedParks}
              </Text>
              <Text style={styles.statLabel}>Parks To Go</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("/(tabs)/explore")}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="map" size={24} color="#2E7D32" />
          </View>
          <Text style={styles.actionText}>Explore Map</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log("Scan QR")}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="qr-code" size={24} color="#2E7D32" />
          </View>
          <Text style={styles.actionText}>Scan QR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log("Find Nearby")}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="location" size={24} color="#2E7D32" />
          </View>
          <Text style={styles.actionText}>Find Nearby</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => console.log("Take Survey")}
        >
          <View style={styles.actionIcon}>
            <Ionicons name="clipboard" size={24} color="#2E7D32" />
          </View>
          <Text style={styles.actionText}>Take Survey</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Parks Near You</Text>
        <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.horizontalScroll}
      >
        {featuredParks.map((park) => (
          <TouchableOpacity
            key={park.id}
            style={styles.parkCard}
            onPress={() => console.log(`View park ${park.id}`)}
          >
            <Image source={park.image} style={styles.parkImage} />
            <View style={styles.parkInfo}>
              <Text style={styles.parkName}>{park.name}</Text>
              <View style={styles.parkMeta}>
                <View style={styles.statusContainer}>
                  <View
                    style={[styles.statusDot, { backgroundColor: "#4CAF50" }]}
                  />
                  <Text style={styles.status}>{park.status}</Text>
                </View>
                <Text style={styles.parkDistance}>{park.distance}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Announcements */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Announcements</Text>
      </View>

      {announcements.map((announcement) => (
        <Card key={announcement.id} style={styles.announcementCard}>
          <Card.Content>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementTitle}>{announcement.title}</Text>
              <Text style={styles.announcementDate}>{announcement.date}</Text>
            </View>
            <Text style={styles.announcementContent}>
              {announcement.content}
            </Text>
          </Card.Content>
        </Card>
      ))}

      <View style={styles.footer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9F6",
    paddingTop: 40,
  },
  welcomeBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "white",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#757575",
    marginTop: 4,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  viewAll: {
    fontSize: 14,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  statLabel: {
    fontSize: 12,
    color: "#757575",
    marginTop: 4,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 16,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: "#2E7D32",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2E7D32",
  },
  horizontalScroll: {
    paddingLeft: 16,
  },
  parkCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: "white",
    overflow: "hidden",
    elevation: 2,
  },
  parkImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  parkInfo: {
    padding: 12,
  },
  parkName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  parkMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  status: {
    fontSize: 12,
    color: "#757575",
  },
  parkDistance: {
    fontSize: 12,
    color: "#757575",
  },
  announcementCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  announcementDate: {
    fontSize: 12,
    color: "#757575",
  },
  announcementContent: {
    fontSize: 14,
    color: "#424242",
  },
  footer: {
    height: 24,
  },
});
