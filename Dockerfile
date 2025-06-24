# Dockerfile for OB ChatBot Relay
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Set environment variable port for Fly.io
ENV PORT 8080
EXPOSE 8080

# Start server
CMD ["node", "index.js"]
