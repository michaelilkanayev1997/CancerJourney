import { render, fireEvent } from "@testing-library/react-native";
import AppContainer from "@components/AppContainer"; // Adjust the path accordingly
import { Text } from "react-native";
import React from "react";

interface TestChildProps {
  setSafeAreaColor: (color: string) => void;
}

const TestChild: React.FC<TestChildProps> = ({ setSafeAreaColor }) => (
  <Text onPress={() => setSafeAreaColor("red")}>Change Color</Text>
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
  test("Placeholder test for async function", async () => {
    // Placeholder test for async function
    function fetchData() {
      return new Promise((resolve) => {
        setTimeout(() => resolve("data"), 100);
      });
    }
    const data = await fetchData();
    expect(data).toBe("data");
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
});
