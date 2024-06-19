import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import AppointmentCard from "@components/AppointmentCard";
import colors from "@utils/colors";
import { useFetchAppointments } from "src/hooks/query";
import Loader from "@ui/Loader";

const Appointments = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const {
    data: appointments = [], // Default to an empty array if data is undefined
    isLoading,
  } = useFetchAppointments();

  const toggleModalVisible = useCallback(() => {
    setModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const handleMoreOptionsPress = useCallback(() => {
    // setOptionModalVisible(true);
    Vibration.vibrate(60);
  }, []);

  console.log(appointments);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

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
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment._id.toString()} // Convert ObjectId to string
              appointment={appointment}
            />
          ))
        ) : (
          <View style={styles.noAppointmentsContainer}>
            <Text style={styles.noAppointmentsText}>
              No Appointments Available
            </Text>
          </View>
        )}
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
  noAppointmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 260,
  },
  noAppointmentsText: {
    marginTop: 0,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.LIGHT_BLUE,
  },
  loader: {
    flex: 1,
    justifyContent: "center", // Center vertically
    alignItems: "center", // Center horizontally
  },
});

export default Appointments;
