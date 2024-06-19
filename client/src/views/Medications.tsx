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

import colors from "@utils/colors";
import Loader from "@ui/Loader";
import { useFetchSchedules } from "src/hooks/query";
import MedicationCard from "@components/MedicationCard";
import { IMedication } from "../../../server/src/models/Schedule";
import { MedicationMoreOptionsModal } from "@components/ScheduleMoreOptionsModal";

const Medications = () => {
  const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);

  const {
    data: medications = [], // Default to an empty array if data is undefined
    isLoading,
  } = useFetchSchedules("medications");

  const OpenAddOptionModal = useCallback(() => {
    setAddModalVisible(true);
    Vibration.vibrate(60);
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <Loader />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.fab}
          onPress={OpenAddOptionModal}
          activeOpacity={0.6}
        >
          <MaterialIcons name="add" size={30} color="white" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.header} numberOfLines={1} ellipsizeMode="tail">
            Medications
          </Text>
          {medications.length > 0 ? (
            medications.map((medication) => (
              <MedicationCard
                key={medication._id.toString()} // Convert ObjectId to string
                medication={medication as IMedication}
              />
            ))
          ) : (
            <View style={styles.noMedicationsContainer}>
              <Text style={styles.noMedicationsText}>
                No Medications Available
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Custom Modal for add Medication */}
      <MedicationMoreOptionsModal
        item={undefined}
        isOptionModalVisible={isAddModalVisible}
        setOptionModalVisible={setAddModalVisible}
        addAppointmentModal={true}
      />
    </>
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
    zIndex: 1001,
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  noMedicationsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 260,
  },
  noMedicationsText: {
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

export default Medications;
