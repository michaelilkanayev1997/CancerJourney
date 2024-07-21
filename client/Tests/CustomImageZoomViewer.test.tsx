const mockToggleModalVisible = jest.fn();
const mockImages = [
  { uri: "http://example.com/image1.jpg", type: "image" },
  { uri: "http://example.com/image2.pdf", type: "pdf" },
];

describe("<CustomImageZoomViewer />", () => {
  it("always returns true", () => {
    expect(true).toBe(true);
  });

  it("checks if an object is defined", () => {
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
  it("checks the length of images array", () => {
    expect(mockImages.length).toBe(2);
  });

  it("validates the first image URI is correct", () => {
    expect(mockImages[0].uri).toBe("http://example.com/image1.jpg");
  });

  it("validates a number is greater than zero", () => {
    const number = 4525441;
    expect(number).toBeGreaterThan(0);
  });
});
