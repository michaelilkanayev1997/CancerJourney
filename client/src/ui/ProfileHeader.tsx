import { FC } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import Avatar from "./Avatar";
import colors from "@utils/colors";
import { UserProfile } from "src/store/auth";
import { convertDateFormat } from "@utils/helper";
import { ProfileStackParamList } from "src/@types/navigation";

export interface Props {
  profile: UserProfile | null;
  toggleModalVisible: () => void;
}

const ProfileHeader: FC<Props> = ({ profile, toggleModalVisible }) => {
  const navigation = useNavigation<NavigationProp<ProfileStackParamList>>();

  const { t } = useTranslation();

  const navigateToSettings = () => {
    navigation.navigate("Settings");
  };

  return (
    <View style={styles.profileHeader} testID="avatar">
      <Avatar onButtonPress={toggleModalVisible} uri={profile?.avatar || ""} />
      <Text style={styles.profileName}>{profile?.name}</Text>
      <View style={styles.row} testID="verified-icon">
        <Text style={styles.profileEmail}>{profile?.email}</Text>
        {profile?.verified ? (
          <MaterialCommunityIcons
            name="check-decagram"
            size={24}
            color={colors.LIGHT_BLUE}
            style={styles.verifiedIcon}
          />
        ) : null}
      </View>
      <Text style={styles.activeSince}>
        {t("active-since")} - {convertDateFormat(profile?.createdAt)}
      </Text>
      <TouchableOpacity
        onPress={navigateToSettings}
        style={styles.settingsIcon}
        testID="settings-icon"
      >
        <Feather name="settings" size={24} color={colors.LIGHT_BLUE} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.LIGHT_GRAY,
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
  row: {
    flexDirection: "row",
  },
  verifiedIcon: {
    paddingLeft: 5,
  },
  settingsIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
});

export default ProfileHeader;
