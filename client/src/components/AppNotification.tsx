import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
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
    <View style={styles.container}>
      {showToast && (
        <Animated.View
          entering={FadeInUp.duration(400)}
          exiting={FadeOutUp.duration(400)}
          style={[styles.notification, { backgroundColor }]}
        >
          <Entypo name={iconName} size={24} color={colors.INACTIVE_CONTRAST} />
          <View>
            <Text
              style={{
                color: colors.INACTIVE_CONTRAST,
                fontWeight: "bold",
                marginLeft: 10,
                fontSize: 16,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                color: colors.INACTIVE_CONTRAST,
                fontWeight: "500",
                marginLeft: 10,
                fontSize: 14,
              }}
            >
              {message}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  notification: {
    top: 10,
    width: "80%",
    position: "absolute",
    borderRadius: 5,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default AppNotification;
