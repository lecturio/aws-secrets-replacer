const replaceSecretsInContent = require("../content");
const getSecret = require("../secret");

jest.mock("../secret");

describe("replaceSecretsInContent", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should replace secret placeholders with actual secrets", async () => {
    const content =
      "Content with %AWS_SECRET:mySecret:key% and %AWS_SECRET:anotherSecret:value%";
    const expectedResult = "Content with secretKey and secretValue";

    getSecret
      .mockResolvedValueOnce({ key: "secretKey" })
      .mockResolvedValueOnce({ value: "secretValue" });

    const updatedContent = await replaceSecretsInContent(content);

    expect(updatedContent).toBe(expectedResult);
    expect(getSecret).toHaveBeenCalledTimes(2);
    expect(getSecret).toHaveBeenNthCalledWith(1, "mySecret");
    expect(getSecret).toHaveBeenNthCalledWith(2, "anotherSecret");
  });

  it("should not replace secret placeholders when secrets are not found", async () => {
    const content = "Content with %AWS_SECRET:nonExistingSecret:key%";

    getSecret.mockResolvedValueOnce(null);

    const updatedContent = await replaceSecretsInContent(content);

    expect(updatedContent).toBe(content);
    expect(getSecret).toHaveBeenCalledTimes(1);
    expect(getSecret).toHaveBeenCalledWith("nonExistingSecret");
  });

  it("should not replace secret placeholders when keyOrValue is not found", async () => {
    const content = "Content with %AWS_SECRET:mySecret:nonExistingKey%";

    getSecret.mockResolvedValueOnce({ key: "secretKey" });

    const updatedContent = await replaceSecretsInContent(content);

    expect(updatedContent).toBe(content);
    expect(getSecret).toHaveBeenCalledTimes(1);
    expect(getSecret).toHaveBeenCalledWith("mySecret");
  });
});
