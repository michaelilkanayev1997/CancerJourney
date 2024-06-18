import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";

import { IAppointment } from "../../../server/src/models/Schedule";
import AppointmentCard from "@components/AppointmentCard";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "@utils/colors";
import { useCallback } from "react";

const appointments: IAppointment[] = [
  {
    _id: "1",
    title: "Doctor Appointment",
    location: "123 Health St",
    date: new Date(),
    notes: "Annual check-up",
    reminder: "1 day before",
  },
  {
    _id: "2",
    title: "Business Meeting",
    location: "456 Corporate Ave",
    date: new Date(),
    notes: "Discuss Q2 targets",
  },
  {
    _id: "3",
    title: "Business Meeting",
    location: "456 Corporate Ave",
    date: new Date(),
    notes: "Discuss Q2 targets",
  },
  {
    _id: "4",
    title: "Business Meeting",
    location: "456 Corporate Ave",
    date: new Date(),
    notes: "Discuss Q2 targets",
  },
  {
    _id: "5",
    title: "Business Meeting",
    location: "456 Corporate Ave",
    date: new Date(),
    notes: "Discuss Q2 targets",
  },
];

const Appointments = () => {
  const handleMoreOptionsPress = useCallback(() => {
    // setOptionModalVisible(true);
    Vibration.vibrate(60);
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.fab}
        onPress={handleMoreOptionsPress}
        activeOpacity={0.6}
      >
        <MaterialIcons name="add" size={30} color="white" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
          Appointments
        </Text>
        {appointments.map((appointment) => (
          <TouchableOpacity
            key={appointment._id}
            onLongPress={handleMoreOptionsPress}
            activeOpacity={0.9}
          >
            <AppointmentCard appointment={appointment} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 10,
    paddingBottom: 100, // Add padding to avoid being covered by the TAB
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fab: {
    position: "absolute",
    right: 15,
    top: 15,
    zIndex: 1000,
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});

export default Appointments;
