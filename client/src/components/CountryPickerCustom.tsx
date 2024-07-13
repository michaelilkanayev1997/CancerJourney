import { FC } from "react";
import { Dimensions } from "react-native";
import { CountryItem, CountryPicker } from "react-native-country-codes-picker";

export interface Props {
  countryPickerVisible: boolean;
  setCountryPickerVisible: (visible: boolean) => void;
  setCountry: (country: { cca2: string; name: string; flag: string }) => void;
}

const CountryPickerCustom: FC<Props> = ({
  countryPickerVisible,
  setCountryPickerVisible,
  setCountry,
}) => {
  const screenHeight = Dimensions.get("window").height;
  const halfHeight = screenHeight / 2;

  const onSelect = (country: CountryItem) => {
    if (typeof country.name.en !== "string") {
      // not a string
      return;
    }

    setCountry({
      cca2: country.code,
      name: country.name.en,
      flag: country.flag,
    });
    setCountryPickerVisible(false); // Close the picker when a country is selected
  };

  return (
    <>
      <CountryPicker
        show={countryPickerVisible}
        pickerButtonOnPress={(item) => {
          onSelect(item);
        }}
        lang="en"
        style={{
          modal: {
            height: halfHeight,
            backgroundColor: "white",
          },
        }}
        enableModalAvoiding={true}
        onBackdropPress={() => setCountryPickerVisible(false)}
      />
    </>
  );
};

export default CountryPickerCustom;
