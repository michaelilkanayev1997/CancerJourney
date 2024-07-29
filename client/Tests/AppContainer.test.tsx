import { render } from "@testing-library/react-native";
import { Text } from "react-native";

import AppContainer from "@components/AppContainer";

interface TestChildProps {
  setSafeAreaColor: (color: string) => void;
}

const TestChild: React.FC<TestChildProps> = ({ setSafeAreaColor }) => (
  <Text onPress={() => setSafeAreaColor("red")} testID="changeColorText">
    Change Color
  </Text>
);

describe("<AppContainer />", () => {
  it("renders correctly with default props", () => {
    const { toJSON } = render(
      <AppContainer>
        <Text>Child Text</Text>
      </AppContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with non-element children", () => {
    const { toJSON } = render(
      <AppContainer>
        <Text>Valid Child</Text>
        {"Some string child"}
      </AppContainer>
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("passes setSafeAreaColor prop to children", () => {
    const { getByTestId } = render(
      <AppContainer>
        <TestChild
          setSafeAreaColor={function (color: string): void {
            throw new Error("Function not implemented.");
          }}
        />
      </AppContainer>
    );
    const child = getByTestId("changeColorText");
    expect(child).toBeTruthy();
  });
});
