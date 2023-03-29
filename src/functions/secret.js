const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const secretsManager = new SecretsManagerClient({
  region: process.env.AWS_REGION,
});

/**
 * Retrieves a secret from AWS Secrets Manager.
 *
 * @param {string} secretName The name of the secret to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves with the secret object, or null if not found.
 */
async function getSecret(secretName) {
  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await secretsManager.send(command);
    return JSON.parse(response.SecretString);
  } catch (error) {
    if (error.code === "ResourceNotFoundException") {
      return null;
    }

    throw error;
  }
}

module.exports = getSecret;
