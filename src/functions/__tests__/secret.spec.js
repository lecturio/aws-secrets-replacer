const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const getSecret = require("../secret");

describe("getSecret", () => {
  let secretsManagerSpy;

  beforeEach(() => {
    secretsManagerSpy = jest.spyOn(SecretsManagerClient.prototype, "send");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should retrieve a secret from AWS Secrets Manager", async () => {
    // Arrange
    const secretName = "my-secret";
    const secretValue = { username: "my-username", password: "my-password" };
    secretsManagerSpy.mockReturnValueOnce({
      SecretString: JSON.stringify(secretValue),
    });

    // Act
    const result = await getSecret(secretName);

    // Assert
    expect(secretsManagerSpy).toHaveBeenCalledTimes(1);
    expect(secretsManagerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ input: { SecretId: secretName } })
    );
    expect(result).toEqual(secretValue);
  });

  it("should return null if the secret is not found", async () => {
    // Arrange
    const secretName = "unknown-secret";
    secretsManagerSpy.mockRejectedValueOnce({
      code: "ResourceNotFoundException",
    });

    // Act
    const result = await getSecret(secretName);

    // Assert
    expect(secretsManagerSpy).toHaveBeenCalledTimes(1);
    expect(secretsManagerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ input: { SecretId: secretName } })
    );
    expect(result).toBeNull();
  });

  it("should re-throw any error other than ResourceNotFoundException", async () => {
    const error = new Error("Something went wrong");
    secretsManagerSpy.mockRejectedValueOnce(error);

    const secretName = "mySecret";
    await expect(getSecret(secretName)).rejects.toThrow(error);

    expect(secretsManagerSpy).toHaveBeenCalledTimes(1);
    expect(secretsManagerSpy).toHaveBeenCalledWith(
      expect.objectContaining({ input: { SecretId: secretName } })
    );
  });
});
