import { FC } from "react";
import { StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { convertDateFormat } from "@utils/helper";

interface Props {
  setShowDateModal: (show: boolean) => void;
  showDateModal: boolean;
  date: Date | string;
  setDate: (formattedDate: Date) => void;
}

const DatePicker: FC<Props> = ({
  setShowDateModal,
  showDateModal,
  setDate,
  date,
}) => {
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDateModal(false);
      return;
    }
    if (selectedDate) {
      setShowDateModal(Platform.OS === "ios");
      setDate(selectedDate);
    }
  };
  const displayDate = date instanceof Date ? convertDateFormat(date) : date;

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowDateModal(true)}
        style={[styles.rowInput, { paddingVertical: 15 }]}
      >
        <Text style={styles.buttonText}>{displayDate}</Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color="gray"
          style={{ paddingRight: 6 }}
        />
      </TouchableOpacity>
      {showDateModal && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          onChange={onDateChange}
          style={{ backgroundColor: "white" }}
          maximumDate={new Date()}
          minimumDate={new Date(1920, 0, 1)}
          is24Hour={true}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  rowInput: {
    flex: 2, // Take up 2/3 of the space
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 5,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    overflow: "hidden", // This is necessary for iOS to clip the shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, // This is for Android
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    width: "70%",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
  },
});

export default DatePicker;
