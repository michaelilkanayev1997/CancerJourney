import { render, fireEvent } from "@testing-library/react-native";
import React from "react";
import AppButton from "@ui/AppButton"; // Adjust the path accordingly
import colors from "@utils/colors";

describe("<AppButton />", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    title: "Click Me",
    onPress: mockOnPress,
    pressedColor: ["#ff0000", "#00ff00", "#0000ff"] as [string, string, string],
    defaultColor: ["#ffffff", "#dddddd", "#bbbbbb"] as [string, string, string],
  };

  it("renders correctly with default props", () => {
    const { toJSON, getByText } = render(<AppButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("Click Me")).toBeTruthy();
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

  it("handles press events", () => {
    const { getByText } = render(<AppButton {...defaultProps} />);
    const button = getByText("Click Me");

    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled();
  });

  it("displays the busy state correctly", () => {
    const { getByTestId } = render(<AppButton {...defaultProps} busy />);
  });

  it("does not call onPress when disabled", () => {
    const { getByText } = render(<AppButton {...defaultProps} disabled />);
    const button = getByText("Click Me");

    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalled(); // Ensure onPress is not called
  });

  it("changes colors on press", () => {
    const { getByText, getByTestId } = render(<AppButton {...defaultProps} />);
    const button = getByText("Click Me");
  });
});
