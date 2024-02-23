import { Entypo } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import colors from "./colors";

interface ConfigProps {
  props: {
    message: string;
  };
}

interface ToastProps {
  type?: string;
  message: string;
}

export const ToastNotification = ({
  type = "Success",
  message,
}: ToastProps) => {
  return Toast.show({
    type,
    props: {
      message,
    },
    visibilityTime: 3000,
  });
};

export const toastConfig = {
  Success: ({ props }: ConfigProps) => (
    <View style={[styles.notification, { backgroundColor: colors.SUCCESS }]}>
      <Entypo name="check" size={24} color={colors.INACTIVE_CONTRAST} />
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>Success</Text>
        <Text style={styles.messageText}>{props.message}</Text>
      </View>
    </View>
  ),
  Error: ({ props }: ConfigProps) => (
    <View style={[styles.notification, { backgroundColor: colors.ERROR }]}>
      <Entypo name="warning" size={24} color={colors.INACTIVE_CONTRAST} />
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>Error</Text>
        <Text style={styles.messageText}>{props.message}</Text>
      </View>
    </View>
  ),
  Info: ({ props }: ConfigProps) => (
    <View style={[styles.notification, { backgroundColor: colors.INFO }]}>
      <Entypo name="info" size={24} color={colors.INACTIVE_CONTRAST} />
      <View style={styles.messageContainer}>
        <Text style={styles.messageTitle}>Info</Text>
        <Text style={styles.messageText}>{props.message}</Text>
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  notification: {
    width: "80%",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageContainer: {
    flexShrink: 1,
    marginLeft: 12,
  },
  messageTitle: {
    color: colors.INACTIVE_CONTRAST,
    fontWeight: "bold",
    fontSize: 16,
  },
  messageText: {
    color: colors.INACTIVE_CONTRAST,
    fontWeight: "400",
    fontSize: 13,
    flexWrap: "wrap",
  },
});
