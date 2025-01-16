# Use the official Node.js image as a base image
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight web server to serve the app
FROM nginx:alpine

# Copy the build output to the Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html
# Define build argument
ARG IMAGE_TAG
ENV IMAGE_TAG=${IMAGE_TAG}


# Expose the port that Nginx will run on
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
