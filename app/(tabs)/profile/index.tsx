import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Avatar, Button, Card, ProgressBar } from "react-native-paper";

const getInitials = (name: string) => {
  const names = name.split(" ");
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};

export default function ProfileScreen() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    completedParks: 4,
    totalParks: 10,
    badges: [
      { id: 1, name: "Explorer", icon: "trail-sign", earned: true },
      { id: 2, name: "Adventurer", icon: "footsteps", earned: true },
      { id: 3, name: "Nature Lover", icon: "leaf", earned: false },
    ],
    activities: [
      {
        id: 1,
        date: "May 10, 2025",
        park: "Kayla's Playground",
        verified: true,
      },
      {
        id: 2,
        date: "May 12, 2025",
        park: "Christine Rathke Memorial Park",
        verified: true,
      },
      {
        id: 3,
        date: "May 15, 2025",
        park: "Dr. Lynette Fox Memorial Park",
        verified: true,
      },
      { id: 4, date: "May 17, 2025", park: "Friendship Park", verified: true },
    ],
  };

  // Get user initials for avatar
  const userInitials = getInitials(user.name);

  return (
    <ScrollView style={styles.container}>
      {/* Header with user info */}
      <View style={styles.header}>
        <Avatar.Text
          size={100}
          label={userInitials}
          style={styles.avatar}
          labelStyle={styles.avatarText}
          color="#FFFFFF"
        />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Button
            mode="outlined"
            style={styles.editButton}
            textColor="#2E7D32"
            compact
          >
            Edit Profile
          </Button>
        </View>
      </View>

      {/* Passport Progress */}
      <Card style={styles.card}>
        <Card.Title
          title="Playground Passport Progress"
          titleStyle={styles.cardTitle}
          left={(props) => (
            <Ionicons name="map-outline" size={props.size} color="#2E7D32" />
          )}
        />
        <Card.Content>
          <Text style={styles.progressText}>
            {user.completedParks} of {user.totalParks} parks visited
          </Text>
          <ProgressBar
            progress={user.completedParks / user.totalParks}
            color="#4CAF50"
            style={styles.progressBar}
          />
          <Text style={styles.progressHint}>
            Visit {user.totalParks - user.completedParks} more parks to complete
            your passport!
          </Text>
          <Button
            mode="contained"
            style={styles.viewPassportButton}
            buttonColor="#4CAF50"
            onPress={() => console.log("View passport")}
          >
            View Passport
          </Button>
        </Card.Content>
      </Card>

      {/* Badges */}
      <Card style={styles.card}>
        <Card.Title
          title="Badges"
          titleStyle={styles.cardTitle}
          left={(props) => (
            <Ionicons name="ribbon-outline" size={props.size} color="#2E7D32" />
          )}
        />
        <Card.Content style={styles.badgeContainer}>
          {user.badges.map((badge) => (
            <View key={badge.id} style={styles.badge}>
              <View
                style={[
                  styles.badgeIcon,
                  !badge.earned && styles.badgeIconLocked,
                ]}
              >
                <Ionicons
                  size={24}
                  color={badge.earned ? "#2E7D32" : "#AAAAAA"}
                />
              </View>
              <Text
                style={[
                  styles.badgeName,
                  !badge.earned && styles.badgeNameLocked,
                ]}
              >
                {badge.name}
              </Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Recent Activity */}
      <Card style={styles.card}>
        <Card.Title
          title="Recent Park Visits"
          titleStyle={styles.cardTitle}
          left={(props) => (
            <Ionicons name="time-outline" size={props.size} color="#2E7D32" />
          )}
        />
        <Card.Content>
          {user.activities.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityInfo}>
                <Text style={styles.parkName}>{activity.park}</Text>
                <Text style={styles.activityDate}>{activity.date}</Text>
              </View>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Download PDF Passport */}
      <Card style={styles.card}>
        <Card.Title
          title="Tools"
          titleStyle={styles.cardTitle}
          left={(props) => (
            <Ionicons
              name="settings-outline"
              size={props.size}
              color="#2E7D32"
            />
          )}
        />
        <Card.Content>
          <Button
            mode="outlined"
            icon="download"
            style={styles.downloadButton}
            textColor="#2E7D32"
            onPress={() => console.log("Download PDF")}
          >
            Download Printable Passport
          </Button>
          <Button
            mode="outlined"
            icon="share"
            style={styles.shareButton}
            textColor="#2E7D32"
            onPress={() => console.log("Share")}
          >
            Share My Progress
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F9F6", // Light green-tinted background
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    padding: 20,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  avatar: {
    backgroundColor: "#2E7D32", // Dark green background for avatar
  },
  avatarText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  userInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2E7D32", // Dark green text
  },
  userEmail: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 8,
  },
  editButton: {
    borderColor: "#2E7D32",
    alignSelf: "flex-start",
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardTitle: {
    color: "#2E7D32", // Dark green text for titles
    fontWeight: "bold",
  },
  progressText: {
    fontSize: 16,
    marginVertical: 8,
    fontWeight: "bold",
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  progressHint: {
    color: "#757575",
    marginBottom: 16,
  },
  viewPassportButton: {
    marginTop: 8,
    borderRadius: 8,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  badge: {
    alignItems: "center",
    width: 80,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F5E9", // Light green background
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  badgeIconLocked: {
    backgroundColor: "#F5F5F5", // Gray background for locked badges
  },
  badgeName: {
    fontSize: 12,
    textAlign: "center",
    color: "#2E7D32",
  },
  badgeNameLocked: {
    color: "#AAAAAA",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  activityInfo: {
    flex: 1,
  },
  parkName: {
    fontSize: 16,
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: "#757575",
  },
  downloadButton: {
    marginVertical: 8,
    borderColor: "#2E7D32",
  },
  shareButton: {
    marginVertical: 8,
    borderColor: "#2E7D32",
  },
});
