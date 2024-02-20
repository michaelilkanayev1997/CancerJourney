import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform, Modal } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import { useDispatch, useSelector } from "react-redux";
import { Entypo } from "@expo/vector-icons";

import colors from "@utils/colors";
import {
  getNotificationState,
  updateNotification,
} from "src/store/notification";

type IconNameType = "warning" | "check" | "info";

const AppNotification: React.FC = () => {
  const { message, type } = useSelector(getNotificationState);
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  let backgroundColor = colors.ERROR;
  let title = "Error";
  let iconName: IconNameType = "warning";

  switch (type) {
    case "success":
      backgroundColor = colors.SUCCESS;
      title = "Success";
      iconName = "check";
      break;
    case "info":
      backgroundColor = colors.INFO;
      title = "Info";
      iconName = "info";
      break;
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    const performAnimation = () => {
      setShowToast(true);

      timeoutId = setTimeout(() => {
        setShowToast(false);
        dispatch(updateNotification({ message: "", type }));
      }, 3000);
    };

    if (message) {
      performAnimation();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [message]);

  return (
    <Modal visible={showToast} transparent={true} animationType="fade">
      <View style={styles.centeredView}>
        <Animated.View
          entering={FadeInUp.duration(400)}
          style={[styles.notification, { backgroundColor }]}
        >
          <Entypo name={iconName} size={24} color={colors.INACTIVE_CONTRAST} />
          <View style={styles.messageContainer}>
            <Text style={styles.messageTitle}>{title}</Text>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
    top: 0,
  },
  notification: {
    width: "80%",
    margin: 20,
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
    marginLeft: 15,
  },
  messageTitle: {
    color: colors.INACTIVE_CONTRAST,
    fontWeight: "bold",
    fontSize: 16,
  },
  messageText: {
    color: colors.INACTIVE_CONTRAST,
    fontWeight: "500",
    fontSize: 14,
    flexWrap: "wrap",
  },
});

export default AppNotification;
