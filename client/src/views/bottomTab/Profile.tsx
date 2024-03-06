import { FC, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Vibration,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import Avatar from "@ui/Avatar";
import colors from "@utils/colors";
import ProfilePhotoModal from "@components/ProfilePhotoModal";
import { getAuthState } from "src/store/auth";

interface Props {}

const Profile: FC<Props> = (props) => {
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const { profile } = useSelector(getAuthState);

  // Placeholder for user data
  const userData = {
    name: "Jane Doe",
    description: "22 year old fighter from the Country Israel",
    email: "jane.doe@example.com",
    phone: "+1234567890",
    location: "Country Side",
    activeSince: "Jan, 2023",
  };

  const toggleModalVisible = useCallback(() => {
    setPhotoModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Avatar
            onButtonPress={toggleModalVisible}
            uri={profile?.avatar || ""}
          />

          <Text style={styles.profileName}>{userData.name}</Text>
          <Text style={styles.profileDescription}>{userData.description}</Text>
          <Text style={styles.activeSince}>
            Active since - {userData.activeSince}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Info</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoItem}>
          <MaterialCommunityIcons name="email" size={24} color="#3498db" />
          <Text style={styles.infoText}>{userData.email}</Text>
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
      <ProfilePhotoModal
        isVisible={PhotoModalVisible}
        toggleModalVisible={toggleModalVisible}
        profile={profile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT,
    paddingBottom: 85,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 20,
  },

  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  profileDescription: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 5,
  },
  activeSince: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 5,
  },
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
