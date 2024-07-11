import { render } from "@testing-library/react-native";
import Loader from "@ui/Loader";

describe("<Loader />", () => {
  it("renders correctly with default props", () => {
    const { toJSON } = render(<Loader />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with blackLoading prop", () => {
    const { toJSON } = render(<Loader blackLoading />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with custom loaderStyle", () => {
    const customStyle = { backgroundColor: "red" };
    const { toJSON } = render(<Loader loaderStyle={customStyle} />);
    expect(toJSON()).toMatchSnapshot();
  });
});
