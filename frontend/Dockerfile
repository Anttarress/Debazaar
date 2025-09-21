# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Use serve to host the built files
RUN npm install -g serve

# Expose port 80
EXPOSE 80

# Serve the built React app
CMD ["serve", "-s", "build", "-l", "80"]
