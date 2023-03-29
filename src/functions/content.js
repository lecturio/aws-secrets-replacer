const getSecret = require("./secret");

/**
 * Replaces secrets placeholders in a string with actual secrets from AWS Secrets Manager.
 *
 * @param {string} content The string containing the placeholders to replace.
 * @returns {Promise<string>} A promise that resolves with the updated string.
 */
async function replaceSecretsInContent(content) {
  // Define the regex pattern to match AWS secret placeholders
  const regex = /%AWS_SECRET:([^:%]+):([^\s%]+)%/g;
  let match;
  let updatedContent = content;

  // Iterate through all matches in the content
  while ((match = regex.exec(content))) {
    // Extract the secret name and key from the match
    const secretName = match[1];
    const keyOrValue = match[2];

    // Retrieve the secret from AWS Secrets Manager
    const secret = await getSecret(secretName);

    // Check if the secret exists and the key is present in the secret
    if (secret && keyOrValue in secret) {
      // Replace the placeholder with the secret value
      const secretValue = secret[keyOrValue];
      updatedContent = updatedContent.replace(match[0], secretValue);
    }
  }

  // Return the updated content with secrets replaced
  return updatedContent;
}

module.exports = replaceSecretsInContent;
