import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeCards from "../../client/src/components/HomeCards"; // Adjust the path as necessary
import { useNavigation } from "@react-navigation/native";

// Mock the useNavigation hook
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

describe("<HomeCards />", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
  });

  it("renders without crashing", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    expect(getByText("upload-files-and-images")).toBeTruthy();
    expect(getByText("manage-appointments")).toBeTruthy();
    expect(getByText("manage-medications")).toBeTruthy();
    expect(getByText("social-forum")).toBeTruthy();
    expect(getByText("new-posts")).toBeTruthy();
    expect(getByText("settings")).toBeTruthy();
  });

  it("navigates to UploadScreen on Upload button press", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    fireEvent.press(getByText("upload-files-and-images"));
    expect(mockNavigate).toHaveBeenCalledWith("UploadScreen");
  });

  it("navigates to Appointments on Manage Appointments button press", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    fireEvent.press(getByText("manage-appointments"));
    expect(mockNavigate).toHaveBeenCalledWith("Schedule", {
      screen: "Appointments",
      params: { appointment: undefined },
    });
  });

  it("navigates to Medications on Manage Medications button press", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    fireEvent.press(getByText("manage-medications"));
    expect(mockNavigate).toHaveBeenCalledWith("Schedule", {
      screen: "Medications",
      params: { medication: undefined },
    });
  });

  it("navigates to Social Forum on Social Forum button press", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    fireEvent.press(getByText("social-forum"));
    expect(mockNavigate).toHaveBeenCalledWith("PostScreen", {
      screen: "SocialTabs",
      params: {
        screen: "Forum",
      },
    });
  });

  it("navigates to New Post on New Posts button press", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    fireEvent.press(getByText("new-posts"));
    expect(mockNavigate).toHaveBeenCalledWith("PostScreen", {
      screen: "SocialTabs",
      params: {
        screen: "New Post",
      },
    });
  });

  it("navigates to Settings on Settings button press", () => {
    const { getByText } = render(<HomeCards screenWidth={400} />);
    fireEvent.press(getByText("settings"));
    expect(mockNavigate).toHaveBeenCalledWith("HomeScreen", {
      screen: "Settings",
    });
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
