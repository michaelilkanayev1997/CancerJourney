import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useCallback, useState } from "react";
import { StyleSheet, Text, Vibration, View } from "react-native";
import { useSelector } from "react-redux";

import { getAuthState } from "src/store/auth";
import ProfilePhotoModal from "@components/ProfilePhotoModal";
import Avatar from "@ui/Avatar";
import colors from "@utils/colors";
import Profile from "@views/bottomTab/Profile";
import Settings from "@views/bottomTab/Settings";

const Tab = createMaterialTopTabNavigator();

const ProfileNavigator = () => {
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const { profile } = useSelector(getAuthState);

  // Placeholder for user data
  const userData = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    activeSince: "Jan, 2023",
  };

  const toggleModalVisible = useCallback(() => {
    setPhotoModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Avatar
          onButtonPress={toggleModalVisible}
          uri={profile?.avatar || ""}
        />

        <Text style={styles.profileName}>{userData.name}</Text>
        <Text style={styles.profileEmail}>{userData.email}</Text>
        <Text style={styles.activeSince}>
          Active since - {userData.activeSince}
        </Text>
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabbarStyle,
          tabBarLabelStyle: styles.tabbarLabelStyle,
        }}
      >
        <Tab.Screen name="Personal" component={Profile} />
        <Tab.Screen name="Posts" component={Settings} />
        <Tab.Screen name="Favorites" component={Settings} />
      </Tab.Navigator>
      <ProfilePhotoModal
        isVisible={PhotoModalVisible}
        toggleModalVisible={toggleModalVisible}
        profile={profile}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabbarStyle: {
    backgroundColor: colors.LIGHT_GREEN,
  },
  tabbarLabelStyle: {
    color: colors.CONTRAST,
    fontSize: 12,
  },
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY_LIGHT,
    paddingBottom: 85,
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: "#7f8c8d",
    marginTop: 1,
  },
  activeSince: {
    fontSize: 14,
    color: "#bdc3c7",
    marginTop: 5,
  },
});

export default ProfileNavigator;
