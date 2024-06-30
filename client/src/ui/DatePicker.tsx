import React, { FC, useState } from "react";
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
  appointmentDate?: boolean;
  style?: object;
}

const DatePicker: FC<Props> = ({
  setShowDateModal,
  showDateModal,
  setDate,
  date,
  appointmentDate = false,
  style,
}) => {
  const [mode, setMode] = useState<"date" | "time">("date");
  const [tempDate, setTempDate] = useState<Date | undefined>(undefined);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDateModal(false);
      return;
    }

    if (selectedDate && appointmentDate) {
      if (mode === "date") {
        setTempDate(selectedDate);
        setMode("time");
      } else {
        const combinedDate = new Date(
          (tempDate || selectedDate).setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes()
          )
        );

        setShowDateModal(false);
        setMode("date");
        setDate(combinedDate);
      }
    } else if (selectedDate) {
      setShowDateModal(Platform.OS === "ios");
      setDate(selectedDate);
    }
  };

  // Check if date is valid
  const parsedDate = new Date(date);
  const displayDate = !isNaN(parsedDate.getTime())
    ? convertDateFormat(date)
    : date;

  //toLocaleString Options
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  if (date instanceof Date) {
    date = date.toLocaleString(undefined, options);
  } else if (date !== "DD/MM/YYYY") {
    date = new Date(date).toLocaleString(undefined, options);
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowDateModal(true)}
        style={[
          styles.rowInput,
          !appointmentDate && styles.registerSpecificStyle,
          style,
        ]}
      >
        <Text
          style={[styles.buttonText, !appointmentDate && { marginLeft: 10 }]}
        >
          {appointmentDate ? date : displayDate?.toString()}
        </Text>
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
          mode={mode}
          onChange={onDateChange}
          style={{ backgroundColor: "white" }}
          maximumDate={appointmentDate ? undefined : new Date()}
          minimumDate={new Date(1920, 0, 1)}
          is24Hour={true}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  rowInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#e1e1e1",
    padding: 5,
    fontSize: 16,
    color: "#000",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  registerSpecificStyle: {
    paddingVertical: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  buttonText: {
    width: "70%",
    fontSize: 16,
    color: "#000",
  },
});

export default DatePicker;
