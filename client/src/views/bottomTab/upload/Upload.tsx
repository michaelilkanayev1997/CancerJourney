import React, { FC, useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Vibration,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { FolderList, Folder, IconName } from "@ui/Folder";
import { UploadStackParamList } from "src/@types/navigation";
import colors from "@utils/colors";
import { useFetchFoldersLength } from "src/hooks/query";

const folders: Array<{
  tName: string;
  name: string;
  icon: IconName;
  key: string;
}> = [
  { tName: "blood-tests", name: "Blood Tests", icon: "blood-bag", key: "1" },
  { tName: "treatments", name: "Treatments", icon: "hospital-box", key: "2" },
  { tName: "medications", name: "Medications", icon: "pill", key: "3" },
  {
    tName: "reports",
    name: "Reports",
    icon: "file-document-edit-outline",
    key: "4",
  },
  { tName: "scans", name: "Scans", icon: "file-image", key: "5" },
  {
    tName: "appointments",
    name: "Appointments",
    icon: "calendar-clock",
    key: "6",
  },
  { tName: "other", name: "Other", icon: "upload-outline", key: "7" },
];

interface Props {}

const Upload: FC<Props> = (props) => {
  const { t } = useTranslation();
  const { data: folderLength, isLoading } = useFetchFoldersLength();

  const scale = useSharedValue(0.5); // Start from a smaller scale
  const paddingBottom = useSharedValue(0); // Initial paddingBottom
  const backgroundColor = useSharedValue(colors.PRIMARY);

  const navigation =
    useNavigation<NativeStackNavigationProp<UploadStackParamList>>();
  const [numColumns, setNumColumns] = useState<number>(2);

  useFocusEffect(
    useCallback(() => {
      // Animate in when the component is focused
      scale.value = withTiming(1, { duration: 300 }); // Scale to normal size
      paddingBottom.value = withTiming(80, { duration: 300 }); // Animate paddingBottom to 80
      backgroundColor.value = withTiming(colors.PRIMARY_LIGHT, {
        duration: 600,
      });

      return () => {
        // Animate out when the component loses focus
        scale.value = withTiming(0.5, { duration: 300 }); // Scale down a bit
        paddingBottom.value = withTiming(0, { duration: 300 }); // Animate back to 0 on exit
        backgroundColor.value = withTiming(colors.PRIMARY, { duration: 600 });
      };
    }, [])
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      paddingBottom: paddingBottom.value,
      backgroundColor: backgroundColor.value,
    };
  });

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            setNumColumns((currentColumns) => (currentColumns === 2 ? 1 : 2));
            Vibration.vibrate(50);
          }}
          style={{ marginRight: 10 }}
        >
          <MaterialCommunityIcons
            name={numColumns === 2 ? "view-grid-outline" : "view-list-outline"}
            size={24}
            color="black"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, numColumns]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <FlatList
        data={folders}
        renderItem={({ item }) =>
          numColumns === 2 ? (
            <Folder
              folderLength={folderLength}
              tName={t(item.tName)}
              name={item.name}
              icon={item.icon}
            />
          ) : (
            <FolderList
              folderLength={folderLength}
              tName={t(item.tName)}
              name={item.name}
              icon={item.icon}
            />
          )
        }
        keyExtractor={(item) => item.key}
        numColumns={numColumns}
        showsVerticalScrollIndicator={false}
        key={numColumns}
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
  },
});

export default Upload;
