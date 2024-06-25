import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

import colors from "@utils/colors";
import StudyCard, { Study } from "@components/StudyCard";
import { CLINICAL_TRIALS_URL } from "@env";

interface Props {}

const Home: FC<Props> = (props) => {
  const navigation = useNavigation();
  const [studies, setStudies] = useState<Study[]>([]);

  // Function to fetch cancer-related clinical studies
  const fetchCancerStudies = async () => {
    try {
      const response = await axios.get(`${CLINICAL_TRIALS_URL}`);

      return response.data;
    } catch (error) {
      console.error("Error fetching cancer studies:", error);
      throw error;
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Enable the drawer gesture and header when HomeScreen is focused
      const parent = navigation.getParent();
      //parent?.setOptions({ swipeEnabled: true, headerShown: true });

      return () => {
        // Disable the drawer gesture and header when HomeScreen is not focused
        parent?.setOptions({ swipeEnabled: false, headerShown: false });
      };
    }, [navigation])
  );

  useEffect(() => {
    const loadStudies = async () => {
      try {
        const data = await fetchCancerStudies();
        setStudies(data.studies);
      } catch (error) {
        console.error(error);
      }
    };

    loadStudies();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("@assets/Icons/cancerjourne-transparent.png")}
        style={styles.header}
        imageStyle={styles.image}
      ></ImageBackground>

      <View style={styles.titleView}>
        <Text style={styles.title}>Latest Studies</Text>
      </View>
      {studies?.length > 0 ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={studies}
          renderItem={({ item }) => <StudyCard study={item} />}
          keyExtractor={(item) =>
            item.protocolSection.identificationModule.nctId
          }
          contentContainerStyle={styles.flatList}
        />
      ) : (
        <Text>Loading...</Text>
      )}

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Upload")}
        >
          <Ionicons name="cloud-upload" size={50} color={colors.LIGHT_BLUE} />
          <Text style={styles.cardText}>Upload Files & Images</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Appointments")}
        >
          <Ionicons name="calendar" size={50} color={colors.LIGHT_BLUE} />
          <Text style={styles.cardText}>Manage Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Medications")}
        >
          <Ionicons name="medkit" size={50} color={colors.LIGHT_BLUE} />
          <Text style={styles.cardText}>Manage Medications</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("SocialPosts")}
        >
          <Ionicons name="chatbox" size={50} color={colors.LIGHT_BLUE} />
          <Text style={styles.cardText}>Social Posts</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("SocialForum")}
        >
          <Ionicons name="people" size={50} color={colors.LIGHT_BLUE} />
          <Text style={styles.cardText}>Social Forum</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("settings")}
        >
          <Ionicons name="settings" size={50} color={colors.LIGHT_BLUE} />
          <Text style={styles.cardText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.LIGHT_GREEN,
    padding: 10,
    alignItems: "center",
  },
  header: {
    width: "90%",
    paddingVertical: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    resizeMode: "contain",
  },
  cardContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 80,
    paddingTop: 10,
  },
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
  title: {
    color: colors.LIGHT_BLUE,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 0,
  },
  titleView: {
    width: "90%",
  },
  flatList: {
    alignItems: "flex-start",
  },
});

export default Home;
