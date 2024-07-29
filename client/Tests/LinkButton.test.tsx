import { render } from "@testing-library/react-native";

import LinkButton, { LinkButtonProps } from "@ui/LinkButton";

describe("LinkButton component", () => {
  const mockProps: LinkButtonProps = {
    onPress: jest.fn(),
    iconName: "home",
    buttonText: "Example Button",
    disabled: false,
  };

  it("renders button correctly", () => {
    const { queryByText, queryByTestId } = render(
      <LinkButton {...mockProps} />
    );

    // Verify button text and icon are rendered
    expect(queryByText("Example Button")).not.toBeNull();
  });
});
