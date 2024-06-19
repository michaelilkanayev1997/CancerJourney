import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { IMedication } from "../../../server/src/models/Schedule";

const MedicationCard: React.FC<{ medication: IMedication }> = ({
  medication,
}) => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut.duration(500)}
      style={styles.card}
    >
      {medication.photo && (
        <Image source={{ uri: medication.photo.url }} style={styles.photo} />
      )}
      <View style={styles.header}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="pill" size={20} color="black" />
          <Text style={styles.name}>{medication.name}</Text>
        </View>

        <TouchableOpacity
          style={styles.moreOption}
          onPress={() => {
            console.log("more");
          }}
        >
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="calendar" size={16} color="gray" />
        <Text style={styles.frequency}>{medication.frequency}</Text>
      </View>
      {medication.timesPerDay && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="gray" />
          <Text style={styles.detail}>
            Times per day: {medication.timesPerDay}
          </Text>
        </View>
      )}
      {medication.specificDays && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="calendar-check-outline"
            size={16}
            color="gray"
          />
          <Text style={styles.detail}>
            Specific days: {medication.specificDays.join(", ")}
          </Text>
        </View>
      )}
      {medication.prescriber && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="doctor" size={16} color="gray" />
          <Text style={styles.detail}>Prescriber: {medication.prescriber}</Text>
        </View>
      )}
      {medication.notes && (
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="note-outline" size={16} color="gray" />
          <Text style={styles.detail}>Notes: {medication.notes}</Text>
        </View>
      )}
      <View style={styles.detailRow}>
        <MaterialCommunityIcons name="clock-outline" size={16} color="gray" />
        <Text style={styles.date}>
          Upload Date: {new Date(medication.date).toDateString()}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  photo: {
    width: "85%",
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 5,
  },
  moreOption: {
    marginLeft: "auto",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  frequency: {
    fontSize: 16,
    color: "gray",
    marginLeft: 5,
  },
  detail: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
  date: {
    fontSize: 13,
    color: "gray",
    marginLeft: 5,
  },
});

export default MedicationCard;
