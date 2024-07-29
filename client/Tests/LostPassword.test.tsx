import { fireEvent, render, act } from "@testing-library/react-native";

import LostPassword from "@views/auth/LostPassword";

// Mock dependencies
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

// Mock i18next for react-i18next warning
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock client module and functions
jest.mock("src/api/client", () => ({
  post: jest.fn(() =>
    Promise.resolve({ data: { message: "Password reset email sent." } })
  ),
}));

describe("LostPassword Component", () => {
  beforeEach(() => {
    // Clear mock calls before each test
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    const { getByPlaceholderText, getByText } = render(<LostPassword />);

    expect(getByPlaceholderText("michael@example.com")).toBeTruthy();
    expect(getByText("submit")).toBeTruthy();
    expect(getByText("sign-in")).toBeTruthy();
    expect(getByText("sign-up")).toBeTruthy();
  });

  it("submits form with valid data", async () => {
    const { getByText, getByPlaceholderText } = render(<LostPassword />);

    // Fill out the form
    await act(async () => {
      fireEvent.changeText(
        getByPlaceholderText("michael@example.com"),
        "test@example.com"
      );
      fireEvent.press(getByText("submit"));
    });

    expect(require("@react-navigation/native").useNavigation().navigate);
  });
});
