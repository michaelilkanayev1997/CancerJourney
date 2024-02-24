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
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Entypo, Ionicons } from "@expo/vector-icons";

import colors from "@utils/colors";

interface Props {}

const CustomDrawer: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: colors.PRIMARY_DARK1 }}
      >
        <ImageBackground
          resizeMode="contain"
          source={require("@assets/Logo.png")}
          style={{ padding: 20 }}
        >
          <Image
            source={require("@assets/user_profile.png")}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500" }}>
            Michael Ilkanayev
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff" }}>Michaelilkanayev@gmail.com</Text>
            <Entypo
              name="mail"
              size={17}
              color="#fff"
              style={{ marginLeft: 10 }}
            />
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="share-social-outline"
              size={22}
              color="black"
              style={{ marginLeft: 10 }}
            />

            <Text style={{ fontSize: 15, marginLeft: 5 }}>
              Share with Friends
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="exit-outline"
              size={22}
              color="black"
              style={{ marginLeft: 10 }}
            />

            <Text style={{ fontSize: 15, marginLeft: 5 }}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default CustomDrawer;
