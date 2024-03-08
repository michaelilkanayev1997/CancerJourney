import { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {}

const Profile: FC<Props> = (props) => {
  // Placeholder for user data
  const userData = {
    phone: "+1234567890",
    location: "Hong Kong",
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Info</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoItem}>
        <MaterialCommunityIcons name="phone" size={24} color="#3498db" />
        <Text style={styles.infoText}>{userData.phone}</Text>
      </View>

      <View style={styles.infoItem}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#3498db" />
        <Text style={styles.infoText}>{userData.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Utilities</Text>
      </View>

      <View style={styles.infoItem}>
        <MaterialCommunityIcons name="phone" size={24} color="#3498db" />
        <Text style={styles.infoText}>{userData.phone}</Text>
      </View>

      <View style={styles.infoItem}>
        <MaterialCommunityIcons name="map-marker" size={24} color="#3498db" />
        <Text style={styles.infoText}>{userData.location}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#ecf0f1",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
  },
  editButton: {
    backgroundColor: "#3498db",
    borderRadius: 15,
    padding: 5,
    paddingHorizontal: 10,
  },
  editButtonText: {
    color: "#fff",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  infoText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#34495e",
  },
});

export default Profile;
