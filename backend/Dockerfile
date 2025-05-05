# Use official Node.js image as base
FROM node:20-alpine

# Set working directory in container
WORKDIR /app

# Copy package.json and package-lock.json first for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy the rest of the app's source code
COPY . .

# Expose the application port
EXPOSE 5000

# Command to start the server
CMD ["node", "src/index.js"]
