import { FC, useState } from "react";
import { View, StyleSheet } from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";

interface Props {}

const CountryPickerCustom: FC<Props> = (props) => {
  const [country, setCountry] = useState<Country | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);

  const onSelect = (country: Country) => {
    setCountry(country);
    setPickerVisible(false); // Close the picker when a country is selected
  };

  return (
    <View style={styles.container}>
      <CountryPicker
        withFilter
        withFlag
        withCountryNameButton
        withAlphaFilter
        withCallingCode
        withCallingCodeButton
        withEmoji
        onSelect={onSelect}
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        withCloseButton
        countryCode={country?.cca2 || "US"}
        containerButtonStyle={styles.button}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  button: {
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 5,
    padding: 8,
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
  },
});

export default CountryPickerCustom;
