import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  Text,
  Vibration,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import { useQueryClient } from "react-query";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";

import colors from "@utils/colors";
import Loader from "@ui/Loader";
import { useScheduleMutations } from "src/hooks/mutations";
import DatePicker from "@ui/DatePicker";
import { ToastNotification, toastConfig } from "@utils/toastConfig";
import catchAsyncError from "src/api/catchError";
import { getClient } from "src/api/client";
import { styles } from "./MoreOptionsModalStyles";
import { IAppointment } from "src/@types/schedule";

interface AppointmentMoreOptionsProps {
  item?: IAppointment;
  isOptionModalVisible: boolean;
  setOptionModalVisible: Dispatch<SetStateAction<boolean>>;
  addAppointmentModal: boolean;
  openFromNotification?: boolean;
}

const AppointmentMoreOptionsModal: FC<AppointmentMoreOptionsProps> = ({
  item,
  isOptionModalVisible,
  setOptionModalVisible,
  addAppointmentModal = false,
  openFromNotification = false,
}) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState<string>(item?.title || "");
  const [location, setLocation] = useState<string>(item?.location || "");
  const [date, setDate] = useState<Date | string>(item?.date || "");
  const [notes, setNotes] = useState<string>(item?.notes || "");
  const [reminder, setReminder] = useState<string>(
    item?.reminder || t("no-reminder")
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [addAppointmentLoading, setAddAppointmentLoading] = useState(false);
  const queryClient = useQueryClient();

  const {
    deleteScheduleMutation,
    deleteLoading,
    updateScheduleMutation,
    updateLoading,
  } = useScheduleMutations();

  useEffect(() => {
    if (openFromNotification && item) {
      setOptionModalVisible(true);
    }
  }, [openFromNotification, item, setOptionModalVisible]);

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setLocation(item.location);
      setDate(item.date);
      setNotes(item.notes || "");
      setReminder(item.reminder);
    }
  }, [item]);

  const handleCloseMoreOptionsPress = useCallback(() => {
    setOptionModalVisible(false);
    Vibration.vibrate(40);
  }, [setOptionModalVisible]);

  const handleTitleChange = useCallback((text: string) => {
    setTitle(text);
  }, []);

  const handleLocationChange = useCallback((text: string) => {
    setLocation(text);
  }, []);

  const handleNotesChange = useCallback((text: string) => {
    setNotes(text);
  }, []);

  const resetFields = () => {
    handleTitleChange("");
    handleLocationChange("");
    setDate("");
    handleNotesChange("");
    setReminder(t("no-reminder"));
  };

  // Delete button is pressed
  const handleDelete = () => {
    if (!item) return;

    deleteScheduleMutation({
      scheduleId: item?._id.toString(),
      scheduleName: "appointments",
      handleCloseMoreOptionsPress,
    });
  };

  // Update button is pressed
  const handleUpdate = async () => {
    if (title === "" || location === "" || date.toString() === "") {
      return;
    } else if (!item) return;

    updateScheduleMutation({
      scheduleId: item?._id.toString(),
      scheduleName: "appointments",
      title,
      location,
      date: new Date(date),
      notes,
      reminder,
      handleCloseMoreOptionsPress,
    });
  };

  const handleAddAppointment = async () => {
    if (title === "" || location === "" || date.toString() === "") {
      ToastNotification({
        type: "ModalError",
        message: t("enter-all-required-fields"),
      });
      return;
    }
    if (location.length < 3) {
      ToastNotification({
        type: "ModalError",
        message: t("location-min-chars"),
      });
      return;
    }
    let isSuccessful = false;

    try {
      setAddAppointmentLoading(true);

      const newAppointment = {
        title,
        location,
        date,
        notes,
        reminder,
      };

      const client = await getClient();

      await client.post("/schedule/add-appointment", newAppointment);

      queryClient.invalidateQueries(["schedules", "appointments"]);

      isSuccessful = true;
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      ToastNotification({
        type: "Error",
        message: errorMessage,
      });
    } finally {
      setAddAppointmentLoading(false);

      if (isSuccessful) {
        handleCloseMoreOptionsPress();
        resetFields();
        ToastNotification({
          message: t("appointment-uploaded-success"),
        });
      }
    }
  };

  return (
    <Modal
      visible={isOptionModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={
        deleteLoading || updateLoading || addAppointmentLoading
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
            disabled={deleteLoading || updateLoading || addAppointmentLoading}
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
                    addAppointmentLoading) && (
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
                        {t("appointment-details")}
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
                    <Text style={styles.label}>{t("title")}</Text>
                    {title.length === 0 ? (
                      <Animated.Text
                        entering={FadeInLeft.duration(500)}
                        exiting={FadeOutRight.duration(500)}
                        style={styles.errorMessage}
                      >
                        {t("required")}
                      </Animated.Text>
                    ) : null}
                  </View>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleTitleChange}
                    value={title}
                    placeholder={t("enter-title-here")}
                    maxLength={40}
                  />

                  <View style={styles.titleWithError}>
                    <Text style={styles.label}>{t("location")}</Text>
                    {location.length === 0 ? (
                      <Animated.Text
                        entering={FadeInLeft.duration(500)}
                        exiting={FadeOutRight.duration(500)}
                        style={styles.errorMessage}
                      >
                        {t("required")}
                      </Animated.Text>
                    ) : null}
                  </View>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleLocationChange}
                    value={location}
                    placeholder={t("enter-location-here")}
                    maxLength={30}
                  />

                  <View style={styles.titleWithError}>
                    <Text style={styles.label}>{t("date-time")}</Text>
                    {date.toString().length === 0 ? (
                      <Animated.Text
                        entering={FadeInLeft.duration(500)}
                        exiting={FadeOutRight.duration(500)}
                        style={styles.errorMessage}
                      >
                        {t("required")}
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

                  <Text style={styles.label}>{t("notes-optional")}</Text>
                  <TextInput
                    style={[styles.input, styles.descriptionInput]}
                    onChangeText={handleNotesChange}
                    value={notes}
                    placeholder={t("enter-notes-here")}
                    multiline
                  />

                  <Text style={styles.label}>{t("reminder-optional")}</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={reminder}
                      onValueChange={(itemValue, itemIndex) =>
                        setReminder(itemValue)
                      }
                      style={styles.picker}
                    >
                      <Picker.Item
                        label={t("no-reminder")}
                        value="No Reminder"
                      />
                      <Picker.Item
                        label={t("1-hour-before")}
                        value="1 hour before"
                      />
                      <Picker.Item
                        label={t("2-hours-before")}
                        value="2 hours before"
                      />
                      <Picker.Item
                        label={t("day-before")}
                        value="The day before"
                      />
                    </Picker>
                  </View>

                  {addAppointmentModal ? (
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        disabled={addAppointmentLoading}
                        onPress={handleAddAppointment}
                        style={[styles.modalActionButton]}
                      >
                        <MaterialCommunityIcons
                          name="plus-circle"
                          size={20}
                          color={colors.LIGHT_BLUE}
                        />
                        <Text style={styles.actionButtonText}>{t("add")}</Text>
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
                        <Text style={styles.actionButtonText}>
                          {t("delete")}
                        </Text>
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
                        <Text style={styles.actionButtonText}>
                          {t("update")}
                        </Text>
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
  );
};

export default AppointmentMoreOptionsModal;
