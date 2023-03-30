# Use the official Node.js 18.15 image as the base image
FROM node:18.15

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install the dependencies using npm
RUN npm ci

# Copy the remaining source code into the container
COPY . .

# Run the index.js script when the container starts
ENTRYPOINT ["node", "src/index.js"]
