import { render, fireEvent } from "@testing-library/react-native";

import CustomPicker from "@components/CustomPicker";
import { NewProfile } from "@components/InputSections";
import { NewPost } from "@views/bottomTab/posts/NewPost";
import { cancerTypes } from "@utils/enums";

// Mock useTranslation hook
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const newProfile: NewProfile = { cancerType: "" };
const newPost: NewPost = { cancerType: "" };

describe("CustomPicker", () => {
  it("renders correctly when visible is true", () => {
    const { getByTestId } = render(
      <CustomPicker
        visible={true}
        newProfile={newProfile}
        setNewProfile={jest.fn()}
        setPickerVisible={jest.fn()}
      />
    );

    expect(getByTestId("modal")).toBeTruthy();
  });

  it("does not render when visible is false", () => {
    const { queryByTestId } = render(
      <CustomPicker
        visible={false}
        newProfile={newProfile}
        setNewProfile={jest.fn()}
        setPickerVisible={jest.fn()}
      />
    );

    expect(queryByTestId("modal")).toBeNull();
  });

  it("renders the list of cancer types", () => {
    const { getByText } = render(
      <CustomPicker
        visible={true}
        newProfile={newProfile}
        setNewProfile={jest.fn()}
        setPickerVisible={jest.fn()}
      />
    );

    expect(getByText("kidney")).toBeTruthy();
    expect(getByText("childhood")).toBeTruthy();
    expect(getByText("appendix")).toBeTruthy();
  });

  it("calls setNewProfile and setPickerVisible on item press", () => {
    const setNewProfileMock = jest.fn();
    const setPickerVisibleMock = jest.fn();
    const { getByText } = render(
      <CustomPicker
        visible={true}
        newProfile={newProfile}
        setNewProfile={setNewProfileMock}
        setPickerVisible={setPickerVisibleMock}
      />
    );

    const firstItem = getByText(cancerTypes[0].value);
    fireEvent.press(firstItem);

    expect(setNewProfileMock).toHaveBeenCalledWith({
      ...newProfile,
      cancerType: cancerTypes[0].value,
    });
    expect(setPickerVisibleMock).toHaveBeenCalledWith(false);
  });
});
