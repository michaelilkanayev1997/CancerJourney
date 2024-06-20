import colors from "@utils/colors";
import { Dispatch, SetStateAction } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

interface Props {
  selectedDays: string[];
  setSelectedDays: Dispatch<SetStateAction<string[]>>;
}

const DaySelector: React.FC<Props> = ({ selectedDays, setSelectedDays }) => {
  const toggleDay = (day: any) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(
        selectedDays.filter((selectedDay) => selectedDay !== day)
      );
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <Animated.View entering={FadeInUp.duration(500)} style={styles.container}>
      <View style={styles.overlay}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDays.includes(day) ? styles.selected : styles.unselected,
            ]}
            onPress={() => toggleDay(day)}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 8, flexDirection: "row", flexWrap: "wrap" },
  overlay: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 2,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    elevation: 3,
    width: "90%",
  },
  dayButton: {
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 5,
    margin: 3,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  selected: {
    backgroundColor: colors.GREEN,
    borderColor: colors.LIGHT_GREEN,
  },
  unselected: {
    backgroundColor: "#fff",
  },
  dayText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "bold",
  },
  selectedDayText: {
    color: "#fff",
  },
});

export default DaySelector;
