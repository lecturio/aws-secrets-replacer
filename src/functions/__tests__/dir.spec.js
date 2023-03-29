const fs = require("fs");
const path = require("path");
const replaceSecretsInDirectory = require("../dir");
const replaceSecretsInContent = require("../content");

jest.mock("fs");
jest.mock("../content", () => jest.fn());

describe("replaceSecretsInDirectory", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should replace secrets in all files in the directory", async () => {
    const dirPath = "/test-dir";
    const file1 = "file1.txt";
    const file2 = "file2.txt";
    const content1 = "content1";
    const content2 = "content2";
    const updatedContent1 = "updatedContent1";
    const updatedContent2 = "updatedContent2";

    fs.readdirSync.mockReturnValue([file1, file2]);
    fs.statSync
      .mockReturnValueOnce({ isDirectory: () => false, isFile: () => true })
      .mockReturnValueOnce({ isDirectory: () => false, isFile: () => true });

    fs.readFileSync.mockReturnValueOnce(content1).mockReturnValueOnce(content2);

    replaceSecretsInContent
      .mockResolvedValueOnce(updatedContent1)
      .mockResolvedValueOnce(updatedContent2);

    await replaceSecretsInDirectory(dirPath);

    expect(replaceSecretsInContent).toHaveBeenCalledTimes(2);
    expect(replaceSecretsInContent).toHaveBeenNthCalledWith(1, content1);
    expect(replaceSecretsInContent).toHaveBeenNthCalledWith(2, content2);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(2);
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      1,
      path.join(dirPath, file1),
      updatedContent1
    );
    expect(fs.writeFileSync).toHaveBeenNthCalledWith(
      2,
      path.join(dirPath, file2),
      updatedContent2
    );
  });

  it("should process nested directories", async () => {
    const dirPath = "/test-dir";
    const nestedDir = "nested";
    const file1 = "file1.txt";
    const content1 = "content1";
    const updatedContent1 = "updatedContent1";

    fs.readdirSync
      .mockReturnValueOnce([nestedDir])
      .mockReturnValueOnce([file1]);

    fs.statSync
      .mockReturnValueOnce({ isDirectory: () => true, isFile: () => false })
      .mockReturnValueOnce({ isDirectory: () => false, isFile: () => true });

    fs.readFileSync.mockReturnValueOnce(content1);

    replaceSecretsInContent.mockResolvedValueOnce(updatedContent1);

    await replaceSecretsInDirectory(dirPath);

    expect(replaceSecretsInContent).toHaveBeenCalledTimes(1);
    expect(replaceSecretsInContent).toHaveBeenCalledWith(content1);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      path.join(dirPath, nestedDir, file1),
      updatedContent1
    );
  });
});
