import { render, fireEvent } from "@testing-library/react-native";
import { useNavigation } from "@react-navigation/native";

import StudyCard, { Study } from "@components/StudyCard";

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockNavigation = useNavigation as jest.Mock;

describe("StudyCard", () => {
  const mockNavigate = jest.fn();
  const study: Study = {
    protocolSection: {
      identificationModule: {
        nctId: "NCT123456",
        briefTitle: "Study Title",
        organization: {
          fullName: "Organization Name",
        },
      },
      statusModule: {
        overallStatus: "Active",
        startDateStruct: {
          date: "2023-01-01",
        },
        completionDateStruct: {
          date: "2024-01-01",
        },
      },
      descriptionModule: {
        briefSummary: "Study summary",
      },
      conditionsModule: {
        conditions: ["Condition1", "Condition2"],
      },
    },
  };

  beforeEach(() => {
    mockNavigation.mockReturnValue({ navigate: mockNavigate });
  });

  it("renders the study card correctly", () => {
    const { getByText } = render(
      <StudyCard study={study} translateY={{} as any} imageUrl="" />
    );

    expect(getByText("Study Title")).toBeTruthy();
    expect(getByText("organization: Organization Name")).toBeTruthy();
    expect(getByText("start-date: 2023-01-01")).toBeTruthy();
    expect(getByText("completion-date: 2024-01-01")).toBeTruthy();
    expect(getByText("conditions: Condition1, Condition2")).toBeTruthy();
  });

  it("navigates to StudyDetails on press", () => {
    const { getByText } = render(
      <StudyCard study={study} translateY={{} as any} imageUrl="" />
    );

    fireEvent.press(getByText("Study Title"));

    expect(mockNavigate).toHaveBeenCalledWith("StudyDetails", {
      study,
      imageUrl: "",
    });
  });

  it("renders the backup image if imageUrl is not provided", () => {
    const { getByTestId } = render(
      <StudyCard study={study} translateY={{} as any} imageUrl="" />
    );

    const image = getByTestId("study-image");
    expect(image.props.source).toEqual(require("@assets/cancerstudy.jpg"));
  });

  it("renders the correct image if imageUrl is provided", () => {
    const imageUrl = "https://example.com/image.jpg";
    const { getByTestId } = render(
      <StudyCard study={study} translateY={{} as any} imageUrl={imageUrl} />
    );

    const image = getByTestId("study-image");
    expect(image.props.source).toEqual({ uri: imageUrl });
  });

  it("TouchableOpacity is clickable", () => {
    const { getByText } = render(
      <StudyCard study={study} translateY={{} as any} imageUrl="" />
    );

    const touchable = getByText("Study Title");
    fireEvent.press(touchable);
    expect(mockNavigate).toHaveBeenCalled();
  });

  it("renders all main sections of the component", () => {
    const { getByText, getByTestId } = render(
      <StudyCard study={study} translateY={{} as any} imageUrl="" />
    );

    expect(getByTestId("study-image")).toBeTruthy();
    expect(getByText("Study Title")).toBeTruthy();
    expect(getByText("organization: Organization Name")).toBeTruthy();
    expect(getByText("start-date: 2023-01-01")).toBeTruthy();
    expect(getByText("completion-date: 2024-01-01")).toBeTruthy();
    expect(getByText("conditions: Condition1, Condition2")).toBeTruthy();
  });
});
