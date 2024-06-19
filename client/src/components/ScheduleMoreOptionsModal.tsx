import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Text,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";

import colors from "@utils/colors";
import Loader from "@ui/Loader";
import { useScheduleMutations } from "src/hooks/mutations";
import { IAppointment } from "../../../server/src/models/Schedule";
import DatePicker from "@ui/DatePicker";

interface Props {
  item: IAppointment;
  isOptionModalVisible: boolean;
  setOptionModalVisible: Dispatch<SetStateAction<boolean>>;
}

const AppointmentMoreOptionsModal: FC<Props> = ({
  item,
  isOptionModalVisible,
  setOptionModalVisible,
}) => {
  const [title, setTitle] = useState<string>(item.title);
  const [location, setLocation] = useState<string>(item.location);
  const [date, setDate] = useState<Date>(item.date);
  const [notes, setNotes] = useState<string>(item.notes || "");
  const [reminder, setReminder] = useState<string>(item.reminder || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    deleteScheduleMutation,
    deleteLoading,
    updateScheduleMutation,
    updateLoading,
  } = useScheduleMutations();

  const handleCloseMoreOptionsPress = useCallback(() => {
    setOptionModalVisible(false);
    Vibration.vibrate(40);
  }, [setOptionModalVisible]);

  const handleNameChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const handleLocationChange = useCallback((text: string) => {
    setLocation(text);
  }, []);

  const handleNotesChange = useCallback((text: string) => {
    setNotes(text);
  }, []);

  // Delete button is pressed
  const handleDelete = () => {
    deleteScheduleMutation({
      scheduleId: item._id.toString(),
      scheduleName: "appointments",
      handleCloseMoreOptionsPress,
    });
  };

  // // Update button is pressed
  //   const handleUpdate = async () => {
  //     if (title === "") {
  //       return;
  //     }

  //     updateFileMutation({
  //       fileId: item._id,
  //       folderName,
  //       title,
  //       description,
  //       handleCloseMoreOptionsPress,
  //     });
  //   };

  return (
    <Modal
      visible={isOptionModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={
        deleteLoading || updateLoading ? undefined : handleCloseMoreOptionsPress
      } // Android back button
    >
      <TouchableWithoutFeedback onPress={handleCloseMoreOptionsPress}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <TouchableOpacity
            activeOpacity={1}
            disabled={deleteLoading || updateLoading}
            onPressOut={handleCloseMoreOptionsPress}
          >
            <ScrollView
              contentContainerStyle={styles.scrollContainer}
              keyboardShouldPersistTaps="handled"
            >
              <View
                style={styles.modalContent}
                onStartShouldSetResponder={() => true}
              >
                {/* Loader Component */}
                {(deleteLoading || updateLoading) && (
                  <View style={styles.loaderOverlay}>
                    <Loader
                      loaderStyle={{
                        width: 150,
                        height: 150,
                      }}
                    />
                  </View>
                )}

                <View style={styles.header}>
                  <View style={styles.appointmentHeader}>
                    <MaterialIcons
                      name="event"
                      size={24}
                      color={colors.LIGHT_BLUE}
                    />
                    <Text style={styles.appointmentText}>
                      Appointment Details
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleCloseMoreOptionsPress}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={24}
                      color="#333"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.titleWithError}>
                  <Text style={styles.label}>Title</Text>
                  {title.length === 0 ? (
                    <Animated.Text
                      entering={FadeInLeft.duration(500)}
                      exiting={FadeOutRight.duration(500)}
                      style={styles.errorMessage}
                    >
                      Title is Required!
                    </Animated.Text>
                  ) : null}
                </View>
                <TextInput
                  style={styles.input}
                  onChangeText={handleNameChange}
                  value={title}
                  placeholder="Enter Name here"
                />

                <View style={styles.titleWithError}>
                  <Text style={styles.label}>Location</Text>
                  {location.length === 0 ? (
                    <Animated.Text
                      entering={FadeInLeft.duration(500)}
                      exiting={FadeOutRight.duration(500)}
                      style={styles.errorMessage}
                    >
                      Location is Required!
                    </Animated.Text>
                  ) : null}
                </View>
                <TextInput
                  style={styles.input}
                  onChangeText={handleLocationChange}
                  value={location}
                  placeholder="Enter Location here"
                />

                <View style={styles.titleWithError}>
                  <Text style={styles.label}>Date</Text>
                  {new Date(date).toDateString().length === 0 ? (
                    <Animated.Text
                      entering={FadeInLeft.duration(500)}
                      exiting={FadeOutRight.duration(500)}
                      style={styles.errorMessage}
                    >
                      Date is Required!
                    </Animated.Text>
                  ) : null}
                </View>
                <DatePicker
                  setShowDateModal={setShowDatePicker}
                  showDateModal={showDatePicker}
                  setDate={(selectedDate) => setDate(selectedDate)}
                  date={date || "DD/MM/YYYY"}
                  appointmentDate={true}
                  style={styles.input}
                />

                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  onChangeText={handleNotesChange}
                  value={notes}
                  placeholder="Enter notes here"
                  multiline
                />

                <Text style={styles.label}>Reminder</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={reminder}
                    onValueChange={(itemValue, itemIndex) =>
                      setReminder(itemValue)
                    }
                    style={styles.picker}
                  >
                    <Picker.Item label="No Reminder" value="No Reminder" />
                    <Picker.Item label="1 hour before" value="1 hour before" />
                    <Picker.Item
                      label="2 hours before"
                      value="2 hours before"
                    />
                    <Picker.Item
                      label="The day before"
                      value="The day before"
                    />
                  </Picker>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    disabled={deleteLoading || updateLoading}
                    onPress={handleDelete}
                    style={[styles.modalActionButton]}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={20}
                      color="#FF5C5C"
                    />
                    <Text style={styles.actionButtonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    disabled={deleteLoading || updateLoading}
                    // onPress={handleUpdate}
                    style={styles.modalActionButton}
                  >
                    <MaterialCommunityIcons
                      name="update"
                      size={20}
                      color="#4A90E2"
                    />
                    <Text style={styles.actionButtonText}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  appointmentHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  appointmentText: {
    marginLeft: 10,
    fontSize: 17,
    fontWeight: "600",
  },
  label: {
    fontSize: 14,
    alignSelf: "flex-start",
    marginLeft: 12,
  },
  input: {
    fontSize: 15,
    height: 40,
    margin: 8,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    borderRadius: 5,
    borderColor: "#ddd",
    alignSelf: "center",
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
  },
  modalActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    elevation: 2,
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1, // Ensure loader is above the overlay
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent overlay
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20, // Match modalContent's borderRadius
  },
  titleWithError: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure this container stretches to fill its parent
  },
  errorMessage: {
    color: colors.ERROR,
    paddingRight: 12,
    fontWeight: "400",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    margin: 8,
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
  },
  picker: {
    width: "100%",
    height: 40,
  },
});

export default AppointmentMoreOptionsModal;
