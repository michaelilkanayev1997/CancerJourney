import { FC } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Study {
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
}

const StudyCard: FC<Props> = ({ study }) => {
  const {
    identificationModule: { nctId, briefTitle, organization },
    statusModule: { overallStatus, startDateStruct, completionDateStruct },
    descriptionModule: { briefSummary },
    conditionsModule: { conditions },
  } = study.protocolSection;

  const imageUrl = require("@assets/Schedule/medicationPhotoPreview.jpg");

  return (
    <View style={styles.card}>
      <View style={styles.imageView}>
        <Image source={imageUrl} style={styles.image} />
      </View>
      <Text style={styles.title}>{briefTitle}</Text>
      {/* <View style={styles.infoRow}>
        <Ionicons name="medkit-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{`Study ID: ${nctId}`}</Text>
      </View> */}
      <View style={styles.infoRow}>
        <Ionicons name="business-outline" size={16} color="#555" />
        <Text
          style={styles.infoText}
        >{`Organization: ${organization.fullName}`}</Text>
      </View>
      {/* <View style={styles.infoRow}>
        <Ionicons name="pulse-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{`Status: ${overallStatus}`}</Text>
      </View> */}
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{`Start: ${startDateStruct.date}`}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="calendar-outline" size={16} color="#555" />
        <Text
          style={styles.infoText}
        >{`Completion: ${completionDateStruct.date}`}</Text>
      </View>
      <View style={styles.infoRow}>
        <Ionicons name="alert-circle-outline" size={16} color="#555" />
        <Text style={styles.infoText}>{`Conditions: ${conditions.join(
          ", "
        )}`}</Text>
      </View>
      {/* <Text style={styles.summary}>{briefSummary}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    width: 250,
    height: 290,
  },
  imageView: {
    alignItems: "center",
    width: "100%",
  },
  image: {
    width: "90%",
    height: 75,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 15,
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
  },
  summary: {
    fontSize: 12,
    color: "#333",
    marginTop: 10,
  },
});

export default StudyCard;
