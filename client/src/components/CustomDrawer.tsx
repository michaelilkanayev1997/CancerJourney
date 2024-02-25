import { FC } from "react";
import {
  View,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import colors from "@utils/colors";
import { getAuthState } from "src/store/auth";

const CustomDrawer: FC<DrawerContentComponentProps> = (drawerItemListProps) => {
  const { profile } = useSelector(getAuthState);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...drawerItemListProps}
        contentContainerStyle={styles.drawerContentScrollView}
      >
        <ImageBackground
          source={require("@assets/green-gradient.jpg")}
          style={styles.userInfo}
          resizeMode="cover"
        >
          <Image
            source={require("@assets/user_profile.png")}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{profile?.name}</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.emailText}>{profile?.email}</Text>
            <Entypo
              name="mail"
              size={17}
              color={colors.INFO}
              style={styles.emailIcon}
            />
          </View>
        </ImageBackground>
        <View style={styles.drawerItemListContainer}>
          <DrawerItemList {...drawerItemListProps} />
        </View>
      </DrawerContentScrollView>
      <View style={styles.footerContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
          <View style={styles.footerButtonContent}>
            <Ionicons name="share-social-outline" size={22} color="black" />
            <Text style={styles.footerButtonText}>Share with Friends</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
          <View style={styles.footerButtonContent}>
            <Ionicons name="exit-outline" size={22} color="black" />
            <Text style={styles.footerButtonText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerContentScrollView: {
    backgroundColor: "#d6ede7",
  },
  userInfo: {
    padding: 20,
  },
  profileImage: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  userName: {
    color: colors.INFO,
    fontSize: 18,
    fontWeight: "500",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  emailText: {
    color: colors.INFO,
  },
  emailIcon: {
    marginLeft: 10,
  },
  drawerItemListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 10,
  },
  footerContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerButton: {
    paddingVertical: 15,
  },
  footerButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  footerButtonText: {
    fontSize: 15,
    marginLeft: 5,
  },
});

export default CustomDrawer;
