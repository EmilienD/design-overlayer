# Build web client
FROM node:20-alpine AS web-client-builder
WORKDIR /usr/src/web
COPY package.json ./
COPY package-lock.json ./
# Disabled because caprover doesn't support buildkit
# ENV PNPM_HOME="/pnpm"
# ENV PATH="$PNPM_HOME:$PATH"
# COPY pnpm-lock.yaml ./
# RUN corepack enable
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN npm ci
ARG GRAPHQL_SERVER_URL
ENV VITE_SERVER_URL=${GRAPHQL_SERVER_URL}
COPY pwa-assets.config.ts ./pwa-assets.config.ts
COPY index.html ./index.html
COPY tsconfig.app.json ./tsconfig.app.json
COPY tsconfig.json ./tsconfig.json
COPY tsconfig.node.json ./tsconfig.node.json
COPY vite.config.ts ./vite.config.ts
COPY src ./src

RUN npm run build:ci

FROM nginx:1.27

COPY ./nginx.conf /etc/nginx/nginx.conf

COPY --from=web-client-builder /usr/src/web/dist /usr/share/nginx/html
