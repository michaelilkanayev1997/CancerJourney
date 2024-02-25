import React, { FC, useCallback } from "react";
import { StyleSheet, FlatList } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "@react-navigation/native";

import Folder, { IconName } from "@ui/Folder";

const folders: Array<{ name: string; icon: IconName; key: string }> = [
  { name: "Blood Tests", icon: "blood-bag", key: "1" },
  { name: "Treatments", icon: "hospital-box", key: "2" },
  { name: "Medications", icon: "pill", key: "3" },
  { name: "Reports", icon: "file-document-edit-outline", key: "4" },
  { name: "Scans", icon: "file-image", key: "5" },
  { name: "Appointments", icon: "calendar-clock", key: "6" },
  { name: "Other", icon: "upload-outline", key: "7" },
];

interface Props {}

const Upload: FC<Props> = (props) => {
  const scale = useSharedValue(0.8); // Start from a smaller scale
  const paddingBottom = useSharedValue(0); // Initial paddingBottom

  useFocusEffect(
    useCallback(() => {
      // Animate in when the component is focused
      scale.value = withTiming(1, { duration: 300 }); // Scale to normal size
      paddingBottom.value = withTiming(80, { duration: 300 }); // Animate paddingBottom to 80
      return () => {
        // Animate out when the component loses focus
        scale.value = withTiming(0.5, { duration: 300 }); // Scale down a bit
        paddingBottom.value = withTiming(0, { duration: 300 }); // Animate back to 0 on exit
      };
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      paddingBottom: paddingBottom.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <FlatList
        data={folders}
        renderItem={({ item }) => <Folder name={item.name} icon={item.icon} />}
        keyExtractor={(item) => item.key}
        numColumns={2}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F5FCFF",
  },
});

export default Upload;
