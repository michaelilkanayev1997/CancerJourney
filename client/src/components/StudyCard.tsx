import { FC } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeStackParamList } from "src/@types/navigation";

export interface Study {
  key?: string;
  protocolSection: {
    identificationModule: {
      nctId: string;
      briefTitle: string;
      organization: {
        fullName: string;
      };
    };
    statusModule: {
      overallStatus: string;
      startDateStruct: {
        date: string;
      };
      completionDateStruct: {
        date: string;
      };
    };
    descriptionModule: {
      briefSummary: string;
    };
    conditionsModule: {
      conditions: string[];
    };
  };
}

interface Props {
  study: Study;
  translateY: Animated.AnimatedInterpolation<string | number>;
  imageUrl: string;
}

const StudyCard: FC<Props> = ({ study, translateY, imageUrl }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const {
    identificationModule: { briefTitle, organization },
    statusModule: { startDateStruct, completionDateStruct },
    conditionsModule: { conditions },
  } = study.protocolSection;

  const imageUrlBackUp = require("@assets/cancerstudy.jpg");

  return (
    <Animated.View style={[styles.card, { transform: [{ translateY }] }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("StudyDetails", { study, imageUrl })}
      >
        <View style={styles.imageView}>
          <Image
            source={imageUrl ? { uri: imageUrl } : imageUrlBackUp}
            style={styles.image}
          />
        </View>
        <Text style={styles.title} numberOfLines={3} ellipsizeMode="tail">
          {briefTitle}
        </Text>
        <View style={styles.infoRow}>
          <Ionicons name="business-outline" size={16} color="#555" />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.infoText}
          >{`Organization: ${organization.fullName}`}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text
            style={styles.infoText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >{`Start: ${
            startDateStruct?.date ? startDateStruct.date : "Date not available"
          }`}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#555" />
          <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
            {" "}
            {`Completion: ${
              completionDateStruct?.date
                ? completionDateStruct.date
                : "Date not available"
            }`}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="alert-circle-outline" size={16} color="#555" />
          <Text
            style={styles.infoText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >{`Conditions: ${conditions.join(", ")}`}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 10,
    padding: 12,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    height: 270,
  },
  imageView: {
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "90%",
    height: 75,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: "#555",
    marginLeft: 5,
    width: "92%",
  },
});

export default StudyCard;
