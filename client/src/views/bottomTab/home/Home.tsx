import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Animated,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

import colors from "@utils/colors";
import StudyCard, { Study } from "@components/StudyCard";
import { CLINICAL_TRIALS_URL, UNSPLASH_ACCESS_KEY } from "@env";
import HomeCards from "@components/HomeCards";
import { useFetchStudyImages } from "src/hooks/query";
import Loader from "@ui/Loader";

const UNSPLASH_URL = `https://api.unsplash.com/photos/random?query=cancer studies&count=10&client_id=${UNSPLASH_ACCESS_KEY}`;

export interface UnsplashImage {
  id: string;
  urls: {
    small: string;
  };
}

interface flatListRenderProps {
  item: Study;
  index: number;
}

const Home: FC = () => {
  const navigation = useNavigation();
  const [studies, setStudies] = useState<Study[]>([]);

  const scrollX = useRef(new Animated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const ITEM_SIZE = screenWidth * 0.72;
  const EMPTY_ITEM_SIZE = (screenWidth - ITEM_SIZE) / 2.55;

  const {
    data: images = [], // Default to an empty array if data is undefined
    isLoading,
  } = useFetchStudyImages(UNSPLASH_URL);

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
    const fetchStudies = async () => {
      try {
        const response = await axios.get(`${CLINICAL_TRIALS_URL}`);

        setStudies([
          { key: "left-spacer" },
          ...response.data.studies,
          { key: "right-spacer" },
        ]);
      } catch (error) {
        console.error("Error fetching studies:", error);
      }
    };
    fetchStudies();
  }, []);

  const renderItem = ({ item, index }: flatListRenderProps) => {
    if (!item.protocolSection || !item.protocolSection.identificationModule) {
      return <View style={{ width: EMPTY_ITEM_SIZE }} />;
    }

    const inputRange = [
      (index - 2) * ITEM_SIZE,
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
    ];

    const translateY = scrollX.interpolate({
      inputRange,
      outputRange: [100, 50, 100],
      extrapolate: "clamp",
    });

    return (
      <View style={{ width: ITEM_SIZE }}>
        <StudyCard
          study={item}
          translateY={translateY}
          imageUrl={images[index % images.length]?.urls?.small}
        />
      </View>
    );
  };

  const keyExtractor = (item: Study, index: number) => {
    return (
      item.protocolSection?.identificationModule?.nctId ||
      item.key ||
      index.toString()
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        source={require("@assets/Icons/cancerjourne-transparent.png")}
        style={styles.header}
        imageStyle={styles.image}
      ></ImageBackground>

      <View style={styles.cardContainer}>
        <HomeCards screenWidth={screenWidth} />
      </View>

      <View style={styles.titleView}>
        <Text style={styles.title}>Latest Studies</Text>
      </View>
      {studies?.length > 0 && !isLoading ? (
        <View style={styles.flatListContainer}>
          <Animated.FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={studies}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.flatList}
            snapToInterval={ITEM_SIZE}
            decelerationRate={0}
            renderToHardwareTextureAndroid
            pagingEnabled
            overScrollMode="never"
            bounces={false}
            snapToAlignment="start"
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
        </View>
      ) : (
        <Loader loaderStyle={{ marginTop: "20%" }} />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.PRIMARY,
    padding: 10,
    alignItems: "center",
  },
  flatListContainer: {
    flex: 1,
  },
  header: {
    width: "90%",
    paddingVertical: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 0,
  },
  titleView: {
    width: "90%",
  },
  flatList: {
    alignItems: "center",
    marginTop: -40,
    paddingBottom: 150,
  },
});

export default Home;
