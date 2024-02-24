import { createNativeStackNavigator } from "@react-navigation/native-stack";

import FolderDetails from "@views/FolderDetails";
import Upload from "@views/bottomTab/Upload";
import { UploadStackParamList } from "src/@types/navigation";

const Stack = createNativeStackNavigator<UploadStackParamList>();

const UploadFileNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="FolderGrid"
        component={Upload}
        options={{ title: "Folders" }}
      />
      <Stack.Screen name="FolderDetails" component={FolderDetails} />
    </Stack.Navigator>
  );
};

export default UploadFileNavigator;
