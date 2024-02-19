import colors from "@utils/colors";
import { FC, ReactNode } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppNotification from "./AppNotification";

interface Props {
  children: ReactNode;
}

const AppContainer: FC<Props> = ({ children }) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppNotification />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.PRIMARY,
  },
});

export default AppContainer;
