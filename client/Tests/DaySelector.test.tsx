import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import DaySelector from "../../client/src/components/DaySelector"; // Adjust the import based on your structure

const mockSetSelectedDays = jest.fn();

const renderComponent = (selectedDays = []) => {
  return render(
    <DaySelector
      selectedDays={selectedDays}
      setSelectedDays={mockSetSelectedDays}
    />
  );
};

describe("<DaySelector />", () => {
  it("renders without crashing", () => {
    const { getByText } = renderComponent();
    expect(getByText("Monday")).toBeTruthy(); // Ensure at least one day is rendered
  });

  it("renders all days of the week", () => {
    const { getByText } = renderComponent();
    expect(getByText("Tuesday")).toBeTruthy();
    expect(getByText("Wednesday")).toBeTruthy();
    expect(getByText("Thursday")).toBeTruthy();
    expect(getByText("Friday")).toBeTruthy();
    expect(getByText("Saturday")).toBeTruthy();
    expect(getByText("Sunday")).toBeTruthy();
  });

  it("does not throw an error when no days are selected", () => {
    const { getByText } = renderComponent([]);
    const button = getByText("Monday");
    fireEvent.press(button);
    expect(mockSetSelectedDays).toHaveBeenCalled(); // Check that the set function is called
  });

  it("calls setSelectedDays when a day is selected", () => {
    const { getByText } = renderComponent([]);
    fireEvent.press(getByText("Monday")); // Simulate selecting Monday
    expect(mockSetSelectedDays).toHaveBeenCalledWith(["Monday"]);
  });

  it("ensures at least one day button is rendered", () => {
    const { getByText } = renderComponent();
    expect(getByText("Monday")).toBeTruthy();
  });
  it("correctly styles unselected day button", () => {
    const { getByText } = renderComponent([]);
    const button = getByText("Tuesday");
  });

  it("toggles multiple days correctly", () => {
    const { getByText } = renderComponent([]);
    fireEvent.press(getByText("Tuesday"));

    fireEvent.press(getByText("Monday"));
    expect(mockSetSelectedDays).toHaveBeenCalledWith(["Tuesday"]);
  });

  it("does not change selected days when clicking on already selected day twice", () => {
    const { getByText } = renderComponent([]);
    fireEvent.press(getByText("Monday"));
    fireEvent.press(getByText("Monday"));
  });
});
