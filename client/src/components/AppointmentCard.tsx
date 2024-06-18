import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { IAppointment } from "./../../../server/src/models/Schedule";

const AppointmentCard: React.FC<{ appointment: IAppointment }> = ({
  appointment,
}) => {
  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut.duration(500)}
      style={styles.card}
    >
      <View style={styles.header}>
        <MaterialIcons name="event" size={24} color="black" />
        <Text style={styles.title}>{appointment.title}</Text>
        <View style={styles.moreOption}>
          <TouchableOpacity
            onPress={() => {
              Vibration.vibrate(50);
              console.log("more");
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={30}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.location}>{appointment.location}</Text>
      <View style={styles.dateContainer}>
        <MaterialIcons name="date-range" size={20} color="black" />
        <Text style={styles.dateText}>
          {new Date(appointment.date).toDateString()}
        </Text>
      </View>
      {appointment.notes && (
        <Text style={styles.notes}>{appointment.notes}</Text>
      )}
      {appointment.reminder && (
        <View style={styles.reminderContainer}>
          <MaterialIcons name="notifications" size={20} color="black" />
          <Text style={styles.reminderText}>{appointment.reminder}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dateText: {
    marginLeft: 5,
    fontSize: 16,
  },
  notes: {
    fontSize: 14,
    color: "gray",
    marginBottom: 10,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    marginLeft: 5,
    fontSize: 16,
    color: "gray",
  },
  moreOption: {
    marginLeft: "auto",
    paddingRight: 0,
  },
});

export default AppointmentCard;
