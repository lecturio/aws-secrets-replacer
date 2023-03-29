const replaceSecretsInDirectory = require("./functions/dir");

function validateEnvironmentVariables() {
  const requiredEnvVars = [
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_REGION",
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Error: Environment variable ${envVar} is not set.`);
      return false;
    }
  }
  return true;
}

if (process.argv.length < 3) {
  console.error("Usage: node index.js <directory>");
  process.exit(1);
}

if (!validateEnvironmentVariables()) {
  process.exit(1);
}

const dirPath = process.argv[2];

replaceSecretsInDirectory(dirPath).catch((error) => {
  console.error("An error occurred while replacing secrets:", error);
});
