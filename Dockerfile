# Build stage
FROM node:22 AS build
WORKDIR /usr/src/app
# Define build argument
ARG IMAGE_TAG
ENV IMAGE_TAG=${IMAGE_TAG}
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
ENV PORT=3000
ENV BASE_LAYOUT_CONFIG_KEY='metronic-react-demo1-8150'
ENV API_URL=https://preview.keenthemes.com/metronic8/laravel/api
ENV VERSION=v8.2.9
ENV THEME_NAME=Metornic
ENV THEME_DEMO=demo1
ENV BOOTSTRAP_DOCS_LINK=https://getbootstrap.com/docs/5.0
ENV SASS_PATH=src/_metronic/assets/sass/core/components
ENV SASS_VARIABLES_PATH=src/_metronic/assets/sass/core/components/_variables.scss
ENV PURCHASE_URL=https://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469
ENV PREVIEW_URL=https://preview.keenthemes.com/metronic8/react/demo1/
ENV PREVIEW_REACT_URL=https://preview.keenthemes.com/metronic8/react
ENV PREVIEW_DOCS_URL=https://preview.keenthemes.com/metronic8/react/docs
ENV THEME_API_URL=https://preview.keenthemes.com/theme-api/api
ENV ENV=development
ENV ITSM_GLPI_API_BASE_URL=https://cobalt.pulsar.ao/apirest.php
ENV ITSM_GLPI_APP_TOKEN=13Azo4gaH0BIdcHLFMRKdfK7wHUVTiHGtYxTGZBN
ENV ITSM_GLPI_USER_TOKEN=THONZ63oRtOdMpnbj8YSVcrQlgFIF24ciWnlfTV1

# Copy custom nginx.conf to the container
#COPY nginx.conf /etc/nginx/nginx.conf

# Copy the build output from the build stage
#COPY --from=build /usr/src/app/dist /usr/share/nginx/html/pulsar/itsm
# Set the base URL for Vite
ARG VITE_BASE_URL=/
ENV VITE_BASE_URL=$VITE_BASE_URL
ARG BASE_URL=/
ENV BASE_URL=$BASE_URL
# Expose port 80
EXPOSE 3000



# Run Nginx in the foreground
CMD ["npm", "run", "serve"]
#sda 