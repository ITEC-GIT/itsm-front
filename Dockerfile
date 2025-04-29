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

#ENV PORT=3000
#ENV VITE_APP_BASE_LAYOUT_CONFIG_KEY='metronic-react-demo1-8150'
#ENV VITE_APP_API_URL=https://preview.keenthemes.com/metronic8/laravel/api
#ENV VITE_APP_VERSION=v8.2.9
#ENV VITE_APP_THEME_NAME=Metornic
#ENV VITE_APP_THEME_DEMO=demo1
#ENV VITE_APP_BOOTSTRAP_DOCS_LINK=https://getbootstrap.com/docs/5.0
#ENV VITE_APP_SASS_PATH=src/_metronic/assets/sass/core/components
#ENV VITE_APP_SASS_VARIABLES_PATH=src/_metronic/assets/sass/core/components/_variables.scss
#ENV VITE_APP_PURCHASE_URL=https://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469
#ENV VITE_APP_PREVIEW_URL=https://preview.keenthemes.com/metronic8/react/demo1/
#ENV VITE_APP_PREVIEW_REACT_URL=https://preview.keenthemes.com/metronic8/react
#ENV VITE_APP_PREVIEW_DOCS_URL=https://preview.keenthemes.com/metronic8/react/docs
#ENV VITE_APP_THEME_API_URL=https://preview.keenthemes.com/theme-api/api
#ENV VITE_APP_ENV=deployment
#ENV VITE_APP_ITSM_GLPI_API_BASE_URL=https://cobalt.pulsar.ao/apirest.php
#ENV VITE_APP_ITSM_GLPI_API_BASE_PROFILES_URL=https://cobalt.pulsar.ao/files/_pictures/
#ENV VITE_APP_ITSM_GLPI_API_BASE_ATTACHMENT_FILES=https://cobalt.pulsar.ao/files
#ENV VITE_APP_ITSM_GLPI_APP_TOKEN=13Azo4gaH0BIdcHLFMRKdfK7wHUVTiHGtYxTGZBN
#ENV VITE_APP_ITSM_GLPI_USER_TOKEN=THONZ63oRtOdMpnbj8YSVcrQlgFIF24ciWnlfTV1
#ENV VITE_APP_ITSM_BACKEND_SERVICE=http://cobalt.pulsar.ao:3008
#ENV VITE_APP_ITSM_NGINX_IMAGES_URL=http://cobalt.pulsar.ao:3007
#ENV VITE_APP_ITSM_GLPI_SSH_URL=https://wssh.pulsar.ao
#ENV VITE_APP_ITSM_GLPI_SSH_WEB_SOCKET=wss://wssh.pulsar.ao
ENV PORT=3000
ENV VITE_APP_BASE_LAYOUT_CONFIG_KEY='metronic-react-demo1-8150'
ENV VITE_APP_API_URL=https://preview.keenthemes.com/metronic8/laravel/api
ENV VITE_APP_VERSION=v8.2.9
ENV VITE_APP_THEME_NAME=Metornic
ENV VITE_APP_THEME_DEMO=demo1
ENV VITE_APP_BOOTSTRAP_DOCS_LINK=https://getbootstrap.com/docs/5.0
ENV VITE_APP_SASS_PATH=src/_metronic/assets/sass/core/components
ENV VITE_APP_SASS_VARIABLES_PATH=src/_metronic/assets/sass/core/components/_variables.scss
ENV VITE_APP_PURCHASE_URL=https://themeforest.net/item/metronic-responsive-admin-dashboard-template/4021469
ENV VITE_APP_PREVIEW_URL=https://preview.keenthemes.com/metronic8/react/demo1/
ENV VITE_APP_PREVIEW_REACT_URL=https://preview.keenthemes.com/metronic8/react
ENV VITE_APP_PREVIEW_DOCS_URL=https://preview.keenthemes.com/metronic8/react/docs
ENV VITE_APP_THEME_API_URL=https://preview.keenthemes.com/theme-api/api
ENV VITE_APP_ENV=development
ENV VITE_APP_ITSM_GLPI_API_BASE_URL=https://cobalt.pulsar.ao/apirest.php
ENV VITE_APP_ITSM_GLPI_API_BASE_PROFILES_URL=https://cobalt.pulsar.ao/files/_pictures/
ENV VITE_APP_ITSM_GLPI_API_BASE_ATTACHMENT_FILES=https://cobalt.pulsar.ao/files
ENV VITE_APP_ITSM_GLPI_APP_TOKEN=13Azo4gaH0BIdcHLFMRKdfK7wHUVTiHGtYxTGZBN
ENV VITE_APP_ITSM_GLPI_USER_TOKEN=THONZ63oRtOdMpnbj8YSVcrQlgFIF24ciWnlfTV1
ENV VITE_APP_ITSM_BACKEND_SERVICE=http://cobalt.pulsar.ao:3008
ENV VITE_APP_ITSM_NGINX_IMAGES_URL=http://cobalt.pulsar.ao:3007
ENV VITE_APP_ITSM_GLPI_SSH_URL=https://wssh.pulsar.ao
ENV VITE_APP_ITSM_GLPI_SSH_WEB_SOCKET=wss://wssh.pulsar.ao
ENV VITE_APP_ITSM_SSH=http://cobalt.pulsar.ao:8000
ENV VITE_APP_ITSM_VNC=http://cobalt.pulsar.ao:8880
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
ARG VITE_BASE_URL=/
ENV VITE_BASE_URL=$VITE_BASE_URL

# Expose port 80
EXPOSE 3000


# Define build argument
ARG IMAGE_TAG
ENV IMAGE_TAG=${IMAGE_TAG}

# Run Nginx in the foreground
CMD ["npm", "run", "serve"]
