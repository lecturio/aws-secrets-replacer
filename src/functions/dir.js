const fs = require("fs");
const path = require("path");

const replaceSecretsInContent = require("./content");

/**
 * Replaces placeholders in files with secrets from AWS Secrets Manager.
 *
 * @param {string} dirPath The path to the directory containing the files to replace placeholders in.
 */
async function replaceSecretsInDirectory(dirPath) {
  // Read the directory and get the list of files
  const files = fs.readdirSync(dirPath);

  // Iterate through each file in the directory
  for (const file of files) {
    // Create the absolute file path
    const filePath = path.join(dirPath, file);
    // Get file or directory information
    const stat = fs.statSync(filePath);

    // If it's a directory, process it recursively
    if (stat.isDirectory()) {
      await replaceSecretsInDirectory(filePath);
    }
    // If it's a file, replace the placeholders with secrets
    else if (stat.isFile()) {
      // Read the file content
      const content = fs.readFileSync(filePath, "utf-8");
      // Replace placeholders with secrets
      const updatedContent = await replaceSecretsInContent(content);
      // Write the updated content back to the file
      fs.writeFileSync(filePath, updatedContent);
    }
  }
}

module.exports = replaceSecretsInDirectory;
