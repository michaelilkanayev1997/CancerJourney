import { FC } from "react";
import { StyleSheet } from "react-native";
import CountryPicker, { Country } from "react-native-country-picker-modal";

interface Props {
  countryPickerVisible: boolean;
  setCountryPickerVisible: (visible: boolean) => void;
  setCountry: (country: { cca2: string; name: string }) => void;
  country: { cca2: string; name: string };
}

const CountryPickerCustom: FC<Props> = ({
  countryPickerVisible,
  setCountryPickerVisible,
  setCountry,
  country,
}) => {
  const onSelect = (country: Country) => {
    if (typeof country.name !== "string") {
      // not a string
      return;
    }

    setCountry({ cca2: country.cca2, name: country.name });
    setCountryPickerVisible(false); // Close the picker when a country is selected
  };

  return (
    <CountryPicker
      withFilter
      withFlag
      withAlphaFilter
      withCallingCode
      withEmoji
      onSelect={onSelect}
      visible={countryPickerVisible}
      onClose={() => setCountryPickerVisible(false)}
      countryCode={(country?.cca2 as any) || "US"}
      containerButtonStyle={{ width: "5%" }}
    />
  );
};
const styles = StyleSheet.create({});

export default CountryPickerCustom;
