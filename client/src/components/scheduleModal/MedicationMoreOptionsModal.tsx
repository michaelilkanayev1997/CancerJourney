import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ImagePickerAsset } from "expo-image-picker";
import { useQueryClient } from "react-query";
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInLeft,
  FadeInUp,
  FadeOutRight,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";

import { IMedication } from "../../../../server/src/models/Schedule";
import { useScheduleMutations } from "src/hooks/mutations";
import { ToastNotification, toastConfig } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import Loader from "@ui/Loader";
import DaySelector from "@components/DaySelector";
import MedicationPhotoModal from "@components/MedicationPhotoModal";
import { styles } from "./MoreOptionsModalStyles";
import colors from "@utils/colors";

interface MedicationMoreOptionsProps {
  item?: IMedication;
  isOptionModalVisible: boolean;
  setOptionModalVisible: Dispatch<SetStateAction<boolean>>;
  addMedicationModal: boolean;
}

const MedicationMoreOptionsModal: FC<MedicationMoreOptionsProps> = ({
  item,
  isOptionModalVisible,
  setOptionModalVisible,
  addMedicationModal = false,
}) => {
  const [name, setName] = useState<string>(item?.name || "");
  const [frequency, setFrequency] = useState<string>(
    item?.frequency || "As needed"
  );
  const [timesPerDay, setTimesPerDay] = useState<string>(
    item?.timesPerDay || "Once a day"
  );
  const [specificDays, setSpecificDays] = useState<string[]>(
    item?.specificDays || []
  );
  const [prescriber, setPrescriber] = useState<string>(item?.prescriber || "");
  const [notes, setNotes] = useState(item?.notes || "");

  const [addMedicationLoading, setAddMedicationLoading] = useState(false);
  const [PhotoModalVisible, setPhotoModalVisible] = useState(false);
  const [photo, setPhoto] = useState<ImagePickerAsset | null>(null);

  const queryClient = useQueryClient();

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
    setName(text);
  }, []);

  const handlePrescriberChange = useCallback((text: string) => {
    setPrescriber(text);
  }, []);

  const handleNotesChange = useCallback((text: string) => {
    setNotes(text);
  }, []);

  const toggleModalVisible = useCallback(() => {
    setPhotoModalVisible((prevVisible) => !prevVisible);
    Vibration.vibrate(50);
  }, []);

  const resetFields = () => {
    handleNameChange("");
    setFrequency("As needed");
    setTimesPerDay("Once a day");
    setSpecificDays([]);
    handlePrescriberChange("");
    handleNotesChange("");
    setPhoto(null);
  };

  useEffect(() => {
    if (frequency === "As needed") {
      setTimesPerDay("Once a day");
      setSpecificDays([]);
    }
  }, [frequency]);

  // Delete button is pressed
  const handleDelete = () => {
    if (!item) return;

    deleteScheduleMutation({
      scheduleId: item?._id.toString(),
      scheduleName: "medications",
      handleCloseMoreOptionsPress,
    });
  };

  // Update button is pressed
  const handleUpdate = async () => {
    if (name === "") {
      ToastNotification({
        type: "ModalError",
        message: "Name is required!",
      });
      return;
    } else if (frequency === "Specific days" && specificDays.length === 0) {
      ToastNotification({
        type: "ModalError",
        message: "Please select specific days!",
      });
      return;
    } else if (!item) return;

    updateScheduleMutation({
      scheduleId: item?._id.toString(),
      scheduleName: "medications",
      name,
      frequency,
      timesPerDay,
      specificDays,
      prescriber,
      notes,
      date: new Date(), // To avoid Validation errors
      handleCloseMoreOptionsPress,
    });
  };

  const handleAddMedication = async () => {
    if (name === "") {
      ToastNotification({
        type: "ModalError",
        message: "Name is required!",
      });
      return;
    } else if (frequency === "Specific days" && specificDays.length === 0) {
      ToastNotification({
        type: "ModalError",
        message: "Please select specific days!",
      });
      return;
    }

    try {
      setAddMedicationLoading(true);

      const formData = new FormData();

      // Append the Body fields to the form
      formData.append("name", name);
      formData.append("frequency", frequency);
      formData.append("timesPerDay", timesPerDay);
      formData.append("specificDays", JSON.stringify(specificDays)); // Convert array to string
      formData.append("prescriber", prescriber);
      formData.append("notes", notes);
      formData.append("date", new Date().toISOString()); // Convert date to string

      if (photo) {
        formData.append("file", {
          uri: photo.uri,
          type: photo.mimeType,
          name: "image.jpg",
        } as any);
      }

      const client = await getClient({
        "Content-Type": "multipart/form-data;",
      });

      const { data } = await client.post("/schedule/add-medication", formData);

      if (!data?.success) {
        throw new Error("Failed to add the medication");
      }

      queryClient.invalidateQueries(["schedules", "medications"]);
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      setAddMedicationLoading(false);
      handleCloseMoreOptionsPress();
      resetFields();
      ToastNotification({
        message: "Medication uploaded successfully!",
      });
    }
  };

  return (
    <>
      <Modal
        visible={isOptionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={
          deleteLoading || updateLoading || addMedicationLoading
            ? undefined
            : handleCloseMoreOptionsPress
        } // Android back button
      >
        <TouchableWithoutFeedback onPress={handleCloseMoreOptionsPress}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalOverlay}
          >
            <TouchableOpacity
              activeOpacity={1}
              disabled={deleteLoading || updateLoading || addMedicationLoading}
              onPressOut={handleCloseMoreOptionsPress}
            >
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
              >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View
                    style={styles.modalContent}
                    onStartShouldSetResponder={() => true}
                  >
                    {/* Loader Component */}
                    {(deleteLoading ||
                      updateLoading ||
                      addMedicationLoading) && (
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
                        <MaterialCommunityIcons
                          name="pill"
                          size={24}
                          color={colors.LIGHT_BLUE}
                        />
                        <Text style={styles.appointmentText}>
                          Medication Details
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
                      <Text style={styles.label}>Name and strength</Text>
                      {name.length === 0 ? (
                        <Animated.Text
                          entering={FadeInLeft.duration(500)}
                          exiting={FadeOutRight.duration(500)}
                          style={styles.errorMessage}
                        >
                          Name is Required!
                        </Animated.Text>
                      ) : null}
                    </View>
                    <TextInput
                      style={styles.input}
                      onChangeText={handleNameChange}
                      value={name}
                      placeholder="Enter Name and strength here"
                      maxLength={40}
                    />

                    <Text style={styles.label}>Frequency (optional)</Text>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={frequency}
                        onValueChange={(itemValue, itemIndex) =>
                          setFrequency(itemValue)
                        }
                        style={styles.picker}
                      >
                        <Picker.Item label="As needed" value="As needed" />
                        <Picker.Item label="Every day" value="Every day" />
                        <Picker.Item
                          label="Specific days"
                          value="Specific days"
                        />
                      </Picker>
                    </View>

                    {/* Times per day is required when frequency is 'Every day' or 'Specific days' */}
                    {frequency === "Every day" ||
                    frequency === "Specific days" ? (
                      <>
                        <Animated.Text
                          entering={FadeInUp.duration(600)}
                          style={styles.label}
                        >
                          Times Per Day
                        </Animated.Text>

                        <Animated.View
                          entering={FadeInUp.duration(600)}
                          style={styles.pickerContainer}
                        >
                          <Picker
                            selectedValue={timesPerDay}
                            onValueChange={(itemValue, itemIndex) =>
                              setTimesPerDay(itemValue)
                            }
                            style={styles.picker}
                          >
                            <Picker.Item
                              label="Once a day"
                              value="Once a day"
                            />
                            <Picker.Item
                              label="2 times a day"
                              value="2 times a day"
                            />
                            <Picker.Item
                              label="3 times a day"
                              value="3 times a day"
                            />
                            <Picker.Item
                              label="4 times a day"
                              value="4 times a day"
                            />
                            <Picker.Item
                              label="5 times a day"
                              value="5 times a day"
                            />
                            <Picker.Item
                              label="6 times a day"
                              value="6 times a day"
                            />
                            <Picker.Item
                              label="7 times a day"
                              value="7 times a day"
                            />
                            <Picker.Item
                              label="8 times a day"
                              value="8 times a day"
                            />
                            <Picker.Item
                              label="9 times a day"
                              value="9 times a day"
                            />
                            <Picker.Item
                              label="10 times a day"
                              value="10 times a day"
                            />
                          </Picker>
                        </Animated.View>
                      </>
                    ) : null}

                    {/* Specific days are required when frequency is 'Specific days' */}
                    {frequency === "Specific days" ? (
                      <>
                        <View style={styles.titleWithError}>
                          <Animated.Text
                            entering={FadeInUp.duration(500)}
                            style={styles.label}
                          >
                            Specific Days
                          </Animated.Text>
                          {specificDays.length === 0 ? (
                            <Animated.Text
                              entering={FadeInLeft.duration(500)}
                              exiting={FadeOutRight.duration(500)}
                              style={styles.errorMessage}
                            >
                              Required!
                            </Animated.Text>
                          ) : null}
                        </View>

                        <DaySelector
                          selectedDays={specificDays}
                          setSelectedDays={setSpecificDays}
                        />
                      </>
                    ) : null}

                    {/* Photo Upload Icon */}

                    {addMedicationModal ? (
                      <>
                        <Text style={styles.label}>Photo (optional)</Text>
                        <View style={styles.photoUploadContainer}>
                          <TouchableOpacity
                            onPress={toggleModalVisible}
                            style={styles.photoUploadButton}
                          >
                            <MaterialCommunityIcons
                              name="camera-outline"
                              size={20}
                              color="white"
                            />
                          </TouchableOpacity>
                          {photo ? (
                            <Image
                              source={{ uri: photo.uri }}
                              style={styles.photoPreview}
                            />
                          ) : (
                            <Image
                              source={require("@assets/Schedule/medicationPhotoPreview.jpg")}
                              style={styles.photoPreview}
                            />
                          )}
                        </View>
                      </>
                    ) : null}

                    <Text style={styles.label}>Prescriber (optional)</Text>
                    <TextInput
                      style={styles.input}
                      onChangeText={handlePrescriberChange}
                      value={prescriber}
                      placeholder="Enter Prescriber here"
                      maxLength={30}
                    />

                    <Text style={styles.label}>Notes (optional)</Text>
                    <TextInput
                      style={[styles.input, styles.descriptionInput]}
                      onChangeText={handleNotesChange}
                      value={notes}
                      placeholder="Enter Notes here"
                      multiline
                    />

                    {addMedicationModal ? (
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity
                          disabled={addMedicationLoading}
                          onPress={handleAddMedication}
                          style={[styles.modalActionButton]}
                        >
                          <MaterialCommunityIcons
                            name="plus-circle"
                            size={20}
                            color={colors.LIGHT_BLUE}
                          />
                          <Text style={styles.actionButtonText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
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
                          onPress={handleUpdate}
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
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
        <Toast config={toastConfig} />
      </Modal>

      <MedicationPhotoModal
        isVisible={PhotoModalVisible}
        toggleModalVisible={toggleModalVisible}
        setPhoto={setPhoto}
        photo={photo}
      />
    </>
  );
};

export default MedicationMoreOptionsModal;
