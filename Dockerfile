# Start from the Node.js 18.7.0 image
FROM --platform=linux/amd64 node:18.7.0-alpine

# Set the working directory in the Docker image
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the whole project
COPY . .

# Build the project if TypeScript
RUN npm run build

# Expose port 2000 for external access
EXPOSE 2000

# Command to run the application
CMD ["node", "-r", "module-alias/register", "dist/index.js"]
