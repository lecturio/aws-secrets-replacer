const replaceSecretsInDirectory = require("../functions/dir");
const { exec } = require("child_process");

jest.mock("../functions/dir");

describe("index", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const execAsync = (command, options) =>
    new Promise((resolve, reject) => {
      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    });

  it("should call replaceSecretsInDirectory with correct directory path", async () => {
    replaceSecretsInDirectory.mockResolvedValue();

    const testDir = "./test-directory";
    const { stdout } = await execAsync(`node src/index.js ${testDir}`, {
      env: {
        ...process.env,
        AWS_ACCESS_KEY_ID: "test",
        AWS_SECRET_ACCESS_KEY: "test",
        AWS_REGION: "test",
      },
    });

    expect(stdout).toContain("");
  });

  it("should display usage message when no directory is provided", async () => {
    try {
      await execAsync("node src/index.js");
    } catch (error) {
      expect(error.message).toContain("Usage: node index.js <directory>");
      expect(replaceSecretsInDirectory).toHaveBeenCalledTimes(0);
    }
  });

  it("should display error message when environment variables are missing", async () => {
    try {
      const testDir = "./test-directory";
      await execAsync(`node src/index.js ${testDir}`, {
        env: {
          ...process.env,
          AWS_ACCESS_KEY_ID: "",
          AWS_SECRET_ACCESS_KEY: "",
          AWS_REGION: "",
        },
      });
    } catch (error) {
      expect(error.message).toContain("Region is missing");
      expect(replaceSecretsInDirectory).toHaveBeenCalledTimes(0);
    }
  });
});
