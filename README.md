# aws-secrets-replacer
Replaces placeholders with secrets stored in the AWS Secrets Manager. The placeholders start and end with % and contain the literal AWS_SECRET followed by a separator : and after the separator there is a string that represents a secret name, a separator again and a string with two possible values "key" and "value". The program replaces the placeholders with a secret retrieved from the AWS Secrets Manager by the name which it found in the placeholder after the first separator. Depending on the second variable it replaces it either with the key or the value.

# Requirements

- Node.js
- AWS IAM user with permissions to read secrets from the AWS Secrets Manager
- AWS CLI configured with the IAM user credentials

# Installation

Clone this repository and the dependencies via:

```bash
npm install
```

# Usage

To run the program, use the following command:

```javascript
npm start -- /path/to/target/directory
```

Replace /path/to/target/directory with the path to the directory containing the files you want to replace placeholders in.

# AWS Permissions

To use this program, your IAM user must have permissions to read secrets from the AWS Secrets Manager. You can use the following policy to grant the necessary permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SecretsManagerRead",
      "Effect": "Allow",
      "Action": [
        "secretsmanager:GetSecretValue",
        "secretsmanager:DescribeSecret"
      ],
      "Resource": "*"
    }
  ]
}
```

# Use at Your Own Risk Disclaimer
This program is provided "as is" without any warranties or guarantees of any kind, either expressed or implied. In no event shall the authors, contributors, or maintainers of this program be liable for any direct, indirect, incidental, special, exemplary, or consequential damages (including, but not limited to, procurement of substitute goods or services; loss of use, data, or profits; or business interruption) however caused and on any theory of liability, whether in contract, strict liability, or tort (including negligence or otherwise) arising in any way out of the use of this program, even if advised of the possibility of such damage.

By using this program, you acknowledge and agree that you have read, understood, and accept the terms of this disclaimer, and that you are using the program at your sole risk. You further agree to indemnify, defend, and hold harmless the authors, contributors, and maintainers of this program from any and all claims, liabilities, damages, or expenses arising from your use of the program.

# License

MIT
