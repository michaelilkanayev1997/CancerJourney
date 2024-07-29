import { render, fireEvent } from "@testing-library/react-native";
import { View } from "react-native";

import AppButton from "@ui/AppButton";

describe("<AppButton />", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    title: "Click Me",
    onPress: mockOnPress,
    pressedColor: ["#ff0000", "#00ff00", "#0000ff"] as [string, string, string],
    defaultColor: ["#ffffff", "#dddddd", "#bbbbbb"] as [string, string, string],
  };

  beforeEach(() => {
    mockOnPress.mockClear();
  });

  it("renders correctly with default props", () => {
    const { toJSON, getByText } = render(<AppButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
    expect(getByText("Click Me")).toBeTruthy();
  });

  test("Placeholder test for async function", async () => {
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

  it("does not call onPress when disabled", () => {
    const { getByText } = render(<AppButton {...defaultProps} disabled />);
    const button = getByText("Click Me");

    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(0);
  });

  it("renders with an icon", () => {
    const { getByTestId } = render(
      <AppButton {...defaultProps} icon={<View testID="icon" />} />
    );
    expect(getByTestId("icon")).toBeTruthy();
  });

  it("renders with custom border radius", () => {
    const customRadius = 10;
    const { getByTestId } = render(
      <AppButton {...defaultProps} borderRadius={customRadius} />
    );
    const button = getByTestId("button-gradient");
    expect(button.props.style.borderRadius).toBe(customRadius);
  });
});
