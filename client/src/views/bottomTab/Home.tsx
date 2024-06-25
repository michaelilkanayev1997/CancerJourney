import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { FC, useCallback, useEffect, useState } from "react";
import axios from "axios";

import colors from "@utils/colors";
import StudyCard, { Study } from "@components/StudyCard";
import { CLINICAL_TRIALS_URL } from "@env";
import HomeCards from "@components/HomeCards";

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

      <View style={styles.cardContainer}>
        <HomeCards />
      </View>

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

    paddingTop: 10,
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
    paddingBottom: 80,
  },
});

export default Home;
