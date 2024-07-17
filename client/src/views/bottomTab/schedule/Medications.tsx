import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RouteProp, useRoute } from "@react-navigation/native";

import colors from "@utils/colors";
import Loader from "@ui/Loader";
import { useFetchSchedules } from "src/hooks/query";
import MedicationCard from "@components/MedicationCard";
import MedicationMoreOptionsModal from "@components/scheduleModal/MedicationMoreOptionsModal";
import { IMedication } from "src/@types/schedule";
import { ScheduleStackParamList } from "src/@types/navigation";

const Medications = () => {
  const { t } = useTranslation();
  const [isAddModalVisible, setAddModalVisible] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<
    IMedication | undefined
  >(undefined);

  const route = useRoute<RouteProp<ScheduleStackParamList, "Medications">>();

  const {
    data: medications = [], // Default to an empty array if data is undefined
    isLoading,
  } = useFetchSchedules("medications");

  const OpenAddOptionModal = useCallback(() => {
    setAddModalVisible(true);
    Vibration.vibrate(60);
  }, []);

  useEffect(() => {
    if (route.params?.medication) {
      setSelectedAppointment(route.params.medication);
      setAddModalVisible(true);
    }
  }, [route.params]);

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
            {t("medications")}
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
                {t("no-medications-available")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Custom Modal for add or view Medication */}
      <MedicationMoreOptionsModal
        item={selectedAppointment}
        isOptionModalVisible={isAddModalVisible}
        setOptionModalVisible={setAddModalVisible}
        addMedicationModal={!selectedAppointment}
        openFromNotification={!!selectedAppointment}
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
