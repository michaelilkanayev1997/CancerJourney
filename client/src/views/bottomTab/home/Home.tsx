import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Dimensions,
  Animated as RNAnimated,
  I18nManager,
} from "react-native";
import { FC, useEffect, useRef, useState } from "react";
import axios from "axios";
import Animated, { ZoomInLeft, ZoomInRight } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

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
  const [studies, setStudies] = useState<Study[]>([]);
  const { t } = useTranslation();

  const scrollX = useRef(new RNAnimated.Value(0)).current;

  const screenWidth = Dimensions.get("window").width;
  const ITEM_SIZE = screenWidth * 0.72;
  const EMPTY_ITEM_SIZE = (screenWidth - ITEM_SIZE) / 2.55;

  const {
    data: images = [], // Default to an empty array if data is undefined
    isLoading,
  } = useFetchStudyImages(UNSPLASH_URL);

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
      <Animated.View
        entering={
          I18nManager.isRTL
            ? ZoomInLeft.duration(1000)
            : ZoomInRight.duration(1000)
        }
        style={{ width: ITEM_SIZE }}
      >
        <StudyCard
          study={item}
          translateY={translateY}
          imageUrl={images[index % images.length]?.urls?.small}
        />
      </Animated.View>
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
    <ScrollView contentContainerStyle={styles.container} overScrollMode="never">
      <ImageBackground
        source={require("@assets/Icons/cancerjourne-transparent.png")}
        style={styles.header}
        imageStyle={styles.image}
      ></ImageBackground>

      <View style={styles.cardContainer}>
        <HomeCards screenWidth={screenWidth} />
      </View>

      <View style={styles.titleView}>
        <Text style={styles.title}>{t("latest-studies")}</Text>
      </View>
      {studies?.length > 0 && !isLoading ? (
        <View style={styles.flatListContainer}>
          <RNAnimated.FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={studies}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={[
              styles.flatList,
              { flexDirection: I18nManager.isRTL ? "row-reverse" : "row" }, // Fixing RTL Problem
            ]}
            snapToInterval={ITEM_SIZE}
            decelerationRate={0}
            renderToHardwareTextureAndroid
            pagingEnabled
            overScrollMode="never"
            bounces={false}
            snapToAlignment="start"
            onScroll={RNAnimated.event(
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
    width: "70%",
    paddingVertical: 22,
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
    marginTop: -38,
    paddingBottom: 120,
  },
});

export default Home;
