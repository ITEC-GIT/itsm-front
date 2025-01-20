# Build stage
FROM node:22 AS build
WORKDIR /usr/src/app
# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Build the Vite app
RUN npm run build

# Check the build output (useful for debugging)
RUN ls -la /usr/src/app/dist

# Production stage with Nginx
#FROM nginx:alpine

# Copy custom nginx.conf to the container
#COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output from the build stage
#COPY --from=build /usr/src/app/dist /usr/share/nginx/html/pulsar/itsm
# Set the base URL for Vite
ARG VITE_BASE_URL=/pulsar/itsm/
ENV VITE_BASE_URL=$VITE_BASE_URL
# Expose port 80
EXPOSE 3000

# Define build argument
ARG IMAGE_TAG
ENV IMAGE_TAG=${IMAGE_TAG}

# Run Nginx in the foreground
CMD ["npm", "run", "serve"]