# Base stage to set up dependencies
FROM --platform=linux/amd64 node:20-alpine AS base
WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Build stage to transpile `src` into `dist`
FROM base AS build

COPY . .

RUN yarn build \
    && yarn install --production --frozen-lockfile

# Final stage for production app image
FROM base AS production

ENV NODE_ENV="production"
ENV PORT=3000

COPY --from=build --chown=node:node /app/package.json /app/yarn.lock ./
COPY --from=build --chown=node:node /app/config ./config
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

# Remove if you don't have public files
COPY --from=build --chown=node:node /app/config ./config

EXPOSE $PORT

CMD ["node", "dist/src/main.js"]
