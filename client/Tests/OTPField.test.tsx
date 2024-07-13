import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import OTPField from "@ui/OTPField"; // Adjust the import path as needed
import colors from "@utils/colors"; // Make sure this path is correct

describe("<OTPField />", () => {
  it("renders correctly", () => {
    const { getByTestId } = render(<OTPField testID="otp-field" />);
    const inputField = getByTestId("otp-field");
    expect(inputField).toBeTruthy();
  });

  it("applies correct styles when focused", () => {
    const { getByTestId } = render(<OTPField testID="otp-field" />);
    const inputField = getByTestId("otp-field");

    // Focus the input field
    fireEvent(inputField, "focus");

    // Check focused styles
    const focusedStyle = inputField.props.style;
    const flattenedFocusedStyle = Array.isArray(focusedStyle)
      ? focusedStyle.reduce((acc, style) => ({ ...acc, ...style }), {})
      : focusedStyle;

    expect(flattenedFocusedStyle.borderWidth).toBe(2);
    expect(flattenedFocusedStyle.borderColor).toBe(colors.SECONDARY);
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
  test("Placeholder test for object property", () => {
    // Placeholder test for object property existence
    const obj = { name: "John", age: 30 };
    expect(obj.name).toBeDefined();
  });

  test("Placeholder test for function call", () => {
    // Placeholder test for function call
    const mockFunction = jest.fn();
    mockFunction();
    expect(mockFunction).toHaveBeenCalled();
  });

  it("applies correct styles when blurred", () => {
    const { getByTestId } = render(<OTPField testID="otp-field" />);
    const inputField = getByTestId("otp-field");

    // Focus and then blur the input field
    fireEvent(inputField, "focus");
    fireEvent(inputField, "blur");

    // Check blurred styles
    const blurredStyle = inputField.props.style;
    const flattenedBlurredStyle = Array.isArray(blurredStyle)
      ? blurredStyle.reduce((acc, style) => ({ ...acc, ...style }), {})
      : blurredStyle;

    expect(flattenedBlurredStyle.borderWidth).toBe(1);
    expect(flattenedBlurredStyle.borderColor).toBe("black");
  });
});
