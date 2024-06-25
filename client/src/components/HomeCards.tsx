import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { BottomTabParamList } from "src/@types/navigation";
import colors from "@utils/colors";

type Props = {};

const HomeCards = (props: Props) => {
  const navigation = useNavigation<NavigationProp<BottomTabParamList>>();

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("UploadScreen")}
      >
        <Ionicons name="cloud-upload" size={50} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Upload Files & Images</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("Schedule", {
            screen: "Appointments",
            params: { appointment: undefined },
          })
        }
      >
        <Ionicons name="calendar" size={50} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Manage Appointments</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("Schedule", {
            screen: "Medications",
            params: { medication: undefined },
          })
        }
      >
        <Ionicons name="medkit" size={50} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Manage Medications</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PostScreen", {
            screen: "Main",
          })
        }
      >
        <Ionicons name="people" size={50} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Social Forum</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("PostScreen", {
            screen: "Posts",
          })
        }
      >
        <Ionicons name="chatbox" size={50} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Social Posts</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("ProfileScreen", {
            screen: "Settings",
          })
        }
      >
        <Ionicons name="settings" size={50} color={colors.LIGHT_BLUE} />
        <Text style={styles.cardText}>Settings</Text>
      </TouchableOpacity>
    </>
  );
};

export default HomeCards;

const styles = StyleSheet.create({
  card: {
    width: "45%",
    height: 150,
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
    padding: 10,
  },
  cardText: {
    marginTop: 5,
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
