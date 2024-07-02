import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { FC } from "react";

import colors from "@utils/colors";

type Props = {
  visible: boolean;
  onRequestClose(): void;
};

const LanguageSettingsModal: FC<Props> = ({ visible, onRequestClose }) => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    onRequestClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <TouchableOpacity
                style={styles.option}
                onPress={() => changeLanguage("en")}
              >
                <Text style={styles.icon}>E</Text>
                <Text style={styles.optionText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => changeLanguage("he")}
              >
                <Text style={styles.icon}>ע</Text>
                <Text style={styles.optionText}>Hebrew</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => changeLanguage("ru")}
              >
                <Text style={styles.icon}>Р</Text>
                <Text style={styles.optionText}>Russian</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.option}
                onPress={() => changeLanguage("ar")}
              >
                <Text style={styles.icon}>ع</Text>
                <Text style={styles.optionText}>Arabic</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LanguageSettingsModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "80%",
    padding: 20,
    elevation: 5,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  optionText: {
    fontSize: 18,
    marginLeft: 10,
    color: "#000",
  },
  icon: {
    width: 30,
    height: 30,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    color: colors.SECONDARY,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
});
