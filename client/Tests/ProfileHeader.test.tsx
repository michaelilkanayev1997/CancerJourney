import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";

import { UserProfile } from "src/store/auth";
import ProfileHeader from "@ui/ProfileHeader";

// Mock useNavigation and useTranslation hooks
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigate = jest.fn();
jest.mocked(useNavigation).mockReturnValue({ navigate: mockNavigate });

const mockProfile: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://example.com/avatar.jpg",
  createdAt: new Date("2021-01-01T00:00:00Z"),
  verified: true,
  followers: [],
  followings: [],
  userType: "",
  diagnosisDate: null,
  cancerType: "",
  stage: "",
  gender: "",
  birthDate: null,
  country: {
    cca2: "",
    name: "",
    flag: "",
  },
  expoPushToken: "",
};

describe("ProfileHeader", () => {
  it("renders correctly with profile data", () => {
    const { getByText, getByTestId } = render(
      <ProfileHeader profile={mockProfile} toggleModalVisible={jest.fn()} />
    );

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("john.doe@example.com")).toBeTruthy();
    expect(getByText("active-since - 01/01/2021")).toBeTruthy();
    expect(getByTestId("avatar")).toBeTruthy();
    expect(getByTestId("verified-icon")).toBeTruthy();
  });

  it("navigates to settings when settings icon is pressed", () => {
    const { getByTestId } = render(
      <ProfileHeader profile={mockProfile} toggleModalVisible={jest.fn()} />
    );

    fireEvent.press(getByTestId("settings-icon"));
    expect(mockNavigate).toHaveBeenCalledWith("Settings");
  });
});
