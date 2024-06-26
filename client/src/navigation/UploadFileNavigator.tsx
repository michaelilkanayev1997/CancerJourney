import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FolderDetails from "@views/bottomTab/upload/FolderDetails";
import Upload from "@views/bottomTab/upload/Upload";
import { UploadStackParamList } from "src/@types/navigation";
import FilePreview from "@views/bottomTab/upload/FilePreview";

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
