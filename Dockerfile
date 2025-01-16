# Use an official Node.js image to build the app
FROM node:22 AS build


# Create the /home/src/app directory
RUN mkdir -p /home/src/app
# Set working directory
WORKDIR /home/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# ...existing code...

# Build the Vite app
RUN npm run build

# List the contents of the /usr/src/app directory to verify the build output
RUN ls -la /home/src/app

# Production image using Nginx
FROM nginx:alpine

# ...existing code...

# Copy the build output from the build stage
COPY --from=build /home/src/app/dist /usr/share/nginx/html

# Make port 80 available to the world outside this container
EXPOSE 80

# Define build argument
ARG IMAGE_TAG
ENV IMAGE_TAG=${IMAGE_TAG}

# Run Nginx
CMD ["nginx", "-g", "daemon off;"]