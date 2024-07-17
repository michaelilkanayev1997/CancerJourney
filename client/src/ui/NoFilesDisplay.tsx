import colors from "@utils/colors";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { View, StyleSheet, Text } from "react-native";

interface Props {}

const NoFilesDisplay: FC<Props> = (props) => {
  const { t } = useTranslation();

  return (
    <View style={styles.noFilesContainer}>
      <Text style={styles.noFilesText}>{t("no-files-to-display")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noFilesContainer: {
    flex: 5,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noFilesText: {
    marginTop: 0,
    fontSize: 18,
    fontWeight: "bold",
    color: colors.LIGHT_BLUE,
  },
});

export default NoFilesDisplay;
