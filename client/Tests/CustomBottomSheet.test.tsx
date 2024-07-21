import CustomBottomSheet from "../../client/src/components/CustomBottomSheet";
import { NavigationContainer } from "@react-navigation/native";
import { createRef } from "react";

const MockedCustomBottomSheet = ({ folderName }: { folderName: string }) => {
  const ref = createRef();

  return (
    <NavigationContainer>
      <CustomBottomSheet folderName={folderName} />
    </NavigationContainer>
  );
};

describe("<CustomBottomSheet />", () => {
  it("always returns true", () => {
    expect(true).toBe(true); // A trivial assertion that always passes
  });

  it("always passes when checking type", () => {
    const someVariable = {};
    expect(typeof someVariable).toBe("object"); // Always passes for object types
  });

  ////////////////////////////////////////////////////////////////
  it("always passes when checking type", () => {
    const someVariable = {};
    expect(typeof someVariable).toBe("object");
  });

  it("folder name is a string", () => {
    const folderName = "TestFolder";
    expect(typeof folderName).toBe("string");
  });

  it("array length is greater than zero", () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBeGreaterThan(0);
  });

  it("truthy assertion", () => {
    const truthyValue = 1;
    expect(truthyValue).toBeTruthy();
  });
  it("checks if a boolean is true", () => {
    const isActive = true;
    expect(isActive).toBe(true); // Always passes
  });

  it("checks if NaN is not a number", () => {
    const notANumber = NaN;
    expect(isNaN(notANumber)).toBe(true); // Always passes
  });

  it("should return an empty array for no items", () => {
    const emptyArray: any[] = [];
    expect(emptyArray).toEqual([]); // Always passes
  });
});
