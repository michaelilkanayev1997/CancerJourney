import {
  Children,
  FC,
  ReactElement,
  ReactNode,
  cloneElement,
  isValidElement,
  useState,
} from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import colors from "@utils/colors";

interface Props {
  children: ReactNode;
}
interface SafeAreaColorChangeable {
  setSafeAreaColor?: (color: string) => void;
}

const AppContainer: FC<Props> = ({ children }) => {
  const [safeAreaColor, setSafeAreaColor] = useState(colors.PRIMARY);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: safeAreaColor }]}
    >
      {/* Clone each child to inject the handleColorChange method as a prop */}
      {Children.map(children, (child) => {
        if (isValidElement<SafeAreaColorChangeable>(child)) {
          return cloneElement(child as ReactElement<SafeAreaColorChangeable>, {
            setSafeAreaColor: setSafeAreaColor,
          });
        }
        return child;
      })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default AppContainer;
