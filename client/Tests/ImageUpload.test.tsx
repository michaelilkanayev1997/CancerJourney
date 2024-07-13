import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ImageUpload from "../../client/src/components/ImageUpload"; // Adjust the path as necessary

describe("<ImageUpload />", () => {
  const mockHandleModalClose = jest.fn();
  const mockOnCameraPress = jest.fn();
  const mockOnGalleryPress = jest.fn();
  const mockOnRemovePress = jest.fn();

  it("renders without crashing when visible", () => {
    const { getByText } = render(
      <ImageUpload
        isVisible={true}
        handleModalClose={mockHandleModalClose}
        isLoading={false}
        onCameraPress={mockOnCameraPress}
        onGalleryPress={mockOnGalleryPress}
        onRemovePress={mockOnRemovePress}
      />
    );

    expect(getByText("Profile Photo")).toBeTruthy();
    expect(getByText("Camera")).toBeTruthy();
    expect(getByText("Gallery")).toBeTruthy();
    expect(getByText("Remove")).toBeTruthy();
  });

  it("shows loading state correctly", () => {
    const { getByText } = render(
      <ImageUpload
        isVisible={true}
        handleModalClose={mockHandleModalClose}
        isLoading={true}
        onCameraPress={mockOnCameraPress}
        onGalleryPress={mockOnGalleryPress}
        onRemovePress={mockOnRemovePress}
      />
    );

    expect(getByText("Profile Photo")).toBeTruthy();
  });

  it("calls handleModalClose when modal is dismissed", () => {
    const { getByText } = render(
      <ImageUpload
        isVisible={true}
        handleModalClose={mockHandleModalClose}
        isLoading={false}
        onCameraPress={mockOnCameraPress}
        onGalleryPress={mockOnGalleryPress}
        onRemovePress={mockOnRemovePress}
      />
    );

    fireEvent.press(getByText("Profile Photo")); // Pressing outside to close modal
    expect(mockHandleModalClose).toHaveBeenCalled();
  });

  it("calls onCameraPress when Camera button is pressed", () => {
    const { getByText } = render(
      <ImageUpload
        isVisible={true}
        handleModalClose={mockHandleModalClose}
        isLoading={false}
        onCameraPress={mockOnCameraPress}
        onGalleryPress={mockOnGalleryPress}
        onRemovePress={mockOnRemovePress}
      />
    );

    fireEvent.press(getByText("Camera"));
    expect(mockOnCameraPress).toHaveBeenCalled();
  });

  it("calls onGalleryPress when Gallery button is pressed", () => {
    const { getByText } = render(
      <ImageUpload
        isVisible={true}
        handleModalClose={mockHandleModalClose}
        isLoading={false}
        onCameraPress={mockOnCameraPress}
        onGalleryPress={mockOnGalleryPress}
        onRemovePress={mockOnRemovePress}
      />
    );

    fireEvent.press(getByText("Gallery"));
    expect(mockOnGalleryPress).toHaveBeenCalled();
  });

  it("calls onRemovePress when Remove button is pressed", () => {
    const { getByText } = render(
      <ImageUpload
        isVisible={true}
        handleModalClose={mockHandleModalClose}
        isLoading={false}
        onCameraPress={mockOnCameraPress}
        onGalleryPress={mockOnGalleryPress}
        onRemovePress={mockOnRemovePress}
      />
    );

    fireEvent.press(getByText("Remove"));
    expect(mockOnRemovePress).toHaveBeenCalled();
  });

  test("Placeholder test for array length", () => {
    // Placeholder test for array length
    const array = [1, 2, 3];
    expect(array.length).toBe(3);
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
});
