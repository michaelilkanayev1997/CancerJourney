import { useCallback, useState } from "react";
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

import { IAppointment } from "../../../server/src/models/schedule";
import { formatParagraph, formatText } from "@utils/helper";
import AppointmentMoreOptionsModal from "./scheduleModal/AppointmentMoreOptionsModal";

interface AppointmentCardProps {
  appointment: IAppointment;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const [isOptionModalVisible, setOptionModalVisible] =
    useState<boolean>(false);

  const handleMoreOptionsPress = useCallback(() => {
    setOptionModalVisible(true);
    Vibration.vibrate(60);
  }, []);

  return (
    <>
      <TouchableOpacity
        onLongPress={handleMoreOptionsPress}
        activeOpacity={0.9}
      >
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut.duration(250)}
          style={styles.card}
        >
          <View style={styles.header}>
            <MaterialIcons name="event" size={20} color="black" />
            <Text style={styles.title}>
              {formatText(appointment.title, 20)}
            </Text>
            <View style={styles.moreOption}>
              <TouchableOpacity onPress={handleMoreOptionsPress}>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="gray" />
            <Text style={styles.location}>
              Location: {appointment.location}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="gray" />
            <Text style={styles.dateText}>
              Date: {new Date(appointment.date).toDateString()}
            </Text>
          </View>
          {appointment.notes && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons
                name="note-outline"
                size={16}
                color="gray"
              />
              <Text style={styles.notes}>
                Notes: {formatParagraph(appointment.notes, 33, 90)}
              </Text>
            </View>
          )}
          {appointment.reminder && (
            <View style={styles.reminderContainer}>
              <MaterialIcons name="notifications" size={16} color="gray" />
              <Text style={styles.reminderText}>
                Reminder: {appointment.reminder}
              </Text>
            </View>
          )}
        </Animated.View>
      </TouchableOpacity>

      {/* Custom Modal for More Options */}
      <AppointmentMoreOptionsModal
        item={appointment}
        isOptionModalVisible={isOptionModalVisible}
        setOptionModalVisible={setOptionModalVisible}
        addAppointmentModal={false}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    paddingLeft: 10,
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
    marginBottom: 8,
  },
  title: {
    paddingLeft: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: "gray",
    marginLeft: 5,
  },
  dateText: {
    fontSize: 16,
    color: "gray",
    marginLeft: 5,
  },
  notes: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },
  reminderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderText: {
    fontSize: 16,
    color: "gray",
    marginLeft: 5,
  },
  moreOption: {
    marginLeft: "auto",
    paddingRight: 0,
  },
});

export default AppointmentCard;
