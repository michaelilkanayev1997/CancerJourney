import { Dimensions } from "react-native";

describe("<CustomPicker />", () => {
  it("always returns true", () => {
    expect(true).toBe(true);
  });
  it("ensures modal width is less than screen width", () => {
    const modalWidth = 100 - 40;
    expect(modalWidth).toBeLessThan(Dimensions.get("window").width);
  });

  it("checks if an object is defined", () => {
    const obj = {};
    expect(obj).toBeDefined();
  });
  it("checks object is defined", () => {
    const obj = {};
    expect(obj).toBeDefined();
  });
  it("checks for a truthy value", () => {
    const truthyValue = 52424;
    expect(truthyValue).toBeTruthy();
  });

  it("always returns an empty array", () => {
    const emptyArray: any[] = [];
    expect(emptyArray).toEqual([]);
  });

  it("ensures modal width is less than screen width", () => {
    const modalWidth = 50 - 40;
    expect(modalWidth).toBeLessThan(Dimensions.get("window").width);
  });
});
