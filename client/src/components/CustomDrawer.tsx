import React, { FC, useState } from "react";
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
} from "@react-navigation/drawer";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import colors from "@utils/colors";
import { getProfile } from "src/store/auth";
import { cancerTypeRibbon, cancerTypes } from "@utils/enums";

const CustomDrawer: FC<DrawerContentComponentProps> = (props) => {
  const profile = useSelector(getProfile);

  const [focusedCancerType, setFocusedCancerType] = useState<string | null>(
    profile?.cancerType || null
  );

  const navigateToMainWithCancerType = (cancerType: string) => {
    props.navigation.navigate("Main", {
      cancerType,
      publicProfile: false,
      publicUserId: "",
    });
    props.navigation.closeDrawer();
  };

  const navigateToMainWithPopularPosts = () => {
    props.navigation.navigate("Main", {
      popularPosts: true,
      cancerType: "",
      publicProfile: false,
      publicUserId: "",
    });
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <>
        <ImageBackground
          source={require("@assets/green-gradient.jpg")}
          style={styles.header}
          resizeMode="cover"
        >
          <Image
            source={
              (profile?.cancerType && cancerTypeRibbon[profile?.cancerType]) ||
              require("@assets/CancerType/other-cancer.png")
            }
            style={styles.profileImage}
          />

          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Forum Type</Text>
          </View>
        </ImageBackground>
        <View style={styles.drawerItemListContainer}>
          <DrawerContentScrollView scrollEnabled={true}>
            <View>
              {cancerTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.drawerItem,
                    focusedCancerType === type.value &&
                      styles.focusedDrawerItem,
                  ]}
                  onPress={() => {
                    setFocusedCancerType(type.value);
                    navigateToMainWithCancerType(type.value);
                  }}
                >
                  <Image
                    source={
                      type.imageUrl ||
                      require("@assets/CancerType/other-cancer.png")
                    }
                    style={{ width: 25, height: 25, marginRight: 10 }}
                  />
                  <Text style={styles.drawerItemLabel}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </DrawerContentScrollView>
        </View>
      </>
      <View style={styles.footerContainer}>
        <TouchableOpacity
          onPress={() => {
            setFocusedCancerType(null);
            navigateToMainWithPopularPosts();
          }}
          style={styles.footerButton}
        >
          <View style={styles.footerButtonContent}>
            <MaterialIcons name="trending-up" size={22} color="black" />
            <Text style={styles.footerButtonText}>Popular Posts</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Settings");
            props.navigation.closeDrawer();
          }}
          style={styles.footerButton}
        >
          <View style={styles.footerButtonContent}>
            <Ionicons name="settings-outline" size={22} color="black" />
            <Text style={styles.footerButtonText}>Settings</Text>
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
  header: {
    padding: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    height: 60,
    width: 60,
    marginBottom: 10,
  },
  userName: {
    color: colors.INFO,
    fontSize: 18,
    fontWeight: "500",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    color: colors.INFO,
  },
  headerIcon: {
    marginLeft: 10,
  },
  drawerItemListContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 0,
  },
  footerContainer: {
    padding: 10,
    paddingBottom: 75,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  footerButton: {
    paddingVertical: 10,
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
  sectionHeader: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 16,
    paddingTop: 10,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  drawerItemIcon: {
    marginRight: 10,
  },
  drawerItemLabel: {
    fontSize: 16,
    color: colors.CONTRAST,
    flexShrink: 1,
  },
  focusedDrawerItem: {
    backgroundColor: colors.VERY_LIGHT_BLUE,
  },
});

export default CustomDrawer;
