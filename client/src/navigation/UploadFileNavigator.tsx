import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import FolderDetails from "@views/bottomTab/upload/FolderDetails";
import Upload from "@views/bottomTab/upload/Upload";
import { UploadStackParamList } from "src/@types/navigation";
import FilePreview from "@views/bottomTab/upload/FilePreview";

const Stack = createNativeStackNavigator<UploadStackParamList>();

const UploadFileNavigator = () => {
  const { t } = useTranslation();
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
          title: t("folders"),
        }}
      />
      <Stack.Screen name="FolderDetails" component={FolderDetails} />
      <Stack.Screen
        name="FilePreview"
        component={FilePreview}
        options={{
          title: t("file-preview"),
        }}
      />
    </Stack.Navigator>
  );
};

export default UploadFileNavigator;
