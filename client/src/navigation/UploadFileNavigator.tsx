import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, View } from "react-native";

import FolderDetails from "@views/FolderDetails";
import Upload from "@views/bottomTab/Upload";
import { UploadStackParamList } from "src/@types/navigation";
import FilePreview from "@views/FilePreview";

const Stack = createNativeStackNavigator<UploadStackParamList>();

const UploadFileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="FolderGrid"
        component={Upload}
        options={{
          title: "Folders",
        }}
      />
      <Stack.Screen name="FolderDetails" component={FolderDetails} />
      <Stack.Screen name="FilePreview" component={FilePreview} />
    </Stack.Navigator>
  );
};

export default UploadFileNavigator;
