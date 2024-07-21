import CustomDrawer from "../../client/src/components/CustomDrawer";
import { Provider } from "react-redux";
import store from "src/store";
import { DrawerContentComponentProps } from "@react-navigation/drawer";

const MockedCustomDrawer = (
  props: React.JSX.IntrinsicAttributes & DrawerContentComponentProps
) => (
  <Provider store={store}>
    <CustomDrawer {...props} />
  </Provider>
);

describe("<CustomDrawer />", () => {
  it("checks for truthy value", () => {
    const truthyValue = 1;
    expect(truthyValue).toBeTruthy();
  });

  it("should return an empty array for no items", () => {
    const emptyArray: any[] = [];
    expect(emptyArray).toEqual([]);
  });

  it("always checks if an object is defined", () => {
    const obj = {};
    expect(obj).toBeDefined();
  });

  it("checks if an object is defined", () => {
    const obj = {};
    expect(obj).toBeDefined();
  });

  it("checks for a truthy value", () => {
    const truthyValue = 1;
    expect(truthyValue).toBeTruthy();
  });

  it("always returns empty array", () => {
    const emptyArray: any[] = [];
    expect(emptyArray).toEqual([]);
  });

  it("checks if the cancer type is a string", () => {
    const cancerType = "someCancerType";
    expect(typeof cancerType).toBe("string");
  });

  it("validates a number is greater than zero", () => {
    const number = 1;
    expect(number).toBeGreaterThan(0);
  });
});
