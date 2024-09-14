# Use a Node image as the base image
FROM node:16-alpine as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Use a smaller image for the final stage
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/build /app/build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
