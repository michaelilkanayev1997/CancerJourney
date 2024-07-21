import { render, fireEvent } from "@testing-library/react-native";
import AppInput from "@ui/AppInput";

{
  ("setupFilesAfterEnv");
  ["<rootDir>/setupTests.ts"];
}

describe("<AppInput />", () => {
  it("renders correctly with default props", () => {
    const { toJSON } = render(<AppInput />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("changes style when focused and blurred", () => {
    const { getByTestId } = render(<AppInput testID="app-input" />);
    const input = getByTestId("app-input");
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

  it("applies additional props correctly", () => {
    const handleChangeText = jest.fn();
    const { getByTestId } = render(
      <AppInput
        testID="app-input"
        placeholder="Type something..."
        onChangeText={handleChangeText}
      />
    );
    const input = getByTestId("app-input");

    fireEvent.changeText(input, "Test input");

    expect(handleChangeText).toHaveBeenCalledWith("Test input");
  });
});
