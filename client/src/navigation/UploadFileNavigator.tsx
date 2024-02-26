import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import FolderDetails from "@views/FolderDetails";
import Upload from "@views/bottomTab/Upload";
import { UploadStackParamList } from "src/@types/navigation";

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
      <Stack.Screen
        name="FolderDetails"
        component={FolderDetails}
        options={({ navigation }) => ({
          headerTitle: () => (
            <View style={{ marginLeft: -25 }}>
              <Text style={{ fontSize: 20 }}>Folder Details</Text>
            </View>
          ),

          headerRight: () => (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("SomeUploadScreen");
                }}
                style={{ marginRight: 15 }}
              >
                <MaterialCommunityIcons
                  name="upload-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.setParams({ toggleLayout: true });
                }}
                style={{ marginRight: 10 }}
              >
                <MaterialCommunityIcons
                  name="view-grid-outline"
                  size={24}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default UploadFileNavigator;
