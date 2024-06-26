import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { BottomTabParamList } from "src/@types/navigation";
import colors from "@utils/colors";

type Props = {
  screenWidth: number;
};

const HomeCards: FC<Props> = ({ screenWidth }) => {
  const navigation = useNavigation<NavigationProp<BottomTabParamList>>();

  const oneThirdScreenWidth = screenWidth / 3.7;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          { width: oneThirdScreenWidth, height: oneThirdScreenWidth },
        ]}
        activeOpacity={0.6}
        onPress={() => navigation.navigate("UploadScreen")}
      >
        <Ionicons name="cloud-upload" size={30} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Upload Files & Images</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          { width: oneThirdScreenWidth, height: oneThirdScreenWidth },
        ]}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("Schedule", {
            screen: "Appointments",
            params: { appointment: undefined },
          })
        }
      >
        <Ionicons name="calendar" size={30} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Manage{"\n"}Appointments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          { width: oneThirdScreenWidth, height: oneThirdScreenWidth },
        ]}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("Schedule", {
            screen: "Medications",
            params: { medication: undefined },
          })
        }
      >
        <Ionicons name="medkit" size={30} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Manage{"\n"}Medications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          { width: oneThirdScreenWidth, height: oneThirdScreenWidth },
        ]}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("PostScreen", {
            screen: "Main",
          })
        }
      >
        <Ionicons name="people" size={30} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Social Forum</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          { width: oneThirdScreenWidth, height: oneThirdScreenWidth },
        ]}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("PostScreen", {
            screen: "Posts",
          })
        }
      >
        <Ionicons name="chatbox" size={30} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Social Posts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.card,
          { width: oneThirdScreenWidth, height: oneThirdScreenWidth },
        ]}
        activeOpacity={0.6}
        onPress={() =>
          navigation.navigate("ProfileScreen", {
            screen: "Settings",
          })
        }
      >
        <Ionicons name="settings" size={30} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Settings</Text>
      </TouchableOpacity>
    </>
  );
};

export default HomeCards;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    padding: 3,
  },
  cardText: {
    marginTop: 1,
    fontSize: 14,
    textAlign: "center",
    color: colors.LIGHT_BLUE,
  },
});
