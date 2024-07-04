import React, { FC } from "react";
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
import { getAuthState } from "src/store/auth";
import { cancerTypes } from "./CustomPicker";

const CustomDrawer: FC<DrawerContentComponentProps> = () => {
  const { profile } = useSelector(getAuthState);

  return (
    <View style={styles.container}>
      <>
        <ImageBackground
          source={require("@assets/green-gradient.jpg")}
          style={styles.header}
          resizeMode="cover"
        >
          <Image
            source={require("@assets/CancerType/other-cancer.png")}
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
                  style={styles.drawerItem}
                  onPress={() => {
                    // props.navigation.navigate('Main', { cancerType: type });
                    // props.navigation.closeDrawer();
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
        <TouchableOpacity onPress={() => {}} style={styles.footerButton}>
          <View style={styles.footerButtonContent}>
            <MaterialIcons name="trending-up" size={22} color="black" />
            <Text style={styles.footerButtonText}>Popular Posts</Text>
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
});

export default CustomDrawer;
