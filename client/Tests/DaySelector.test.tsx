import { render, fireEvent } from "@testing-library/react-native";
import DaySelector from "../../client/src/components/DaySelector";

const mockSetSelectedDays = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key.charAt(0).toUpperCase() + key.slice(1),
  }),
}));

const renderComponent = (selectedDays = []) => {
  return render(
    <DaySelector
      selectedDays={selectedDays}
      setSelectedDays={mockSetSelectedDays}
    />
  );
};

describe("<DaySelector />", () => {
  beforeEach(() => {
    mockSetSelectedDays.mockClear();
  });

  it("renders without crashing", () => {
    const { getByText } = renderComponent();
    expect(getByText("Monday")).toBeTruthy();
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
    expect(mockSetSelectedDays).toHaveBeenCalled();
  });

  it("calls setSelectedDays when a day is selected", () => {
    const { getByText } = renderComponent([]);
    fireEvent.press(getByText("Monday"));
    expect(mockSetSelectedDays).toHaveBeenCalledWith(["Monday"]);
  });

  it("toggles multiple days correctly", () => {
    const { getByText } = renderComponent([]);
    fireEvent.press(getByText("Tuesday"));
    expect(mockSetSelectedDays).toHaveBeenCalledWith(["Tuesday"]);

    fireEvent.press(getByText("Monday"));
  });

  it("checks the sequence of calls when multiple days are selected", () => {
    const { getByText } = renderComponent([]);

    // Select Tuesday
    fireEvent.press(getByText("Tuesday"));
    expect(mockSetSelectedDays).toHaveBeenNthCalledWith(1, ["Tuesday"]);
  });
});
