FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# VITE_* values are inlined at BUILD time. Setting them as Cloud Run runtime
# env vars does nothing — they must be passed as --build-arg here, or the
# bundle silently falls back to http://localhost:3005 (see src/services/axios.ts).
ARG VITE_REACT_APP_BACKEND_URL
ARG VITE_CAPTCHA_KEY
RUN test -n "$VITE_REACT_APP_BACKEND_URL" \
  || (echo "ERROR: --build-arg VITE_REACT_APP_BACKEND_URL is required" && exit 1)
ENV VITE_REACT_APP_BACKEND_URL=$VITE_REACT_APP_BACKEND_URL \
    VITE_CAPTCHA_KEY=$VITE_CAPTCHA_KEY

RUN npm run build

FROM nginx:1.27-alpine

# Cloud Run requires listening on $PORT. The nginx image's entrypoint runs
# envsubst over /etc/nginx/templates/*.template before starting, so no custom
# entrypoint is needed.
ENV PORT=8080

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080
