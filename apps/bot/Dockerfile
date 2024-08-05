FROM node:lts-bullseye AS base
WORKDIR /app

# Install build dependencies
FROM base AS build-env
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install bun
FROM base AS bun-install
RUN npm i -g bun

# Copy the monorepo into the image
FROM bun-install AS copy-source
COPY ../../ /app

# Install and build monorepo dependencies
FROM copy-source AS build-deps
RUN bun install --no-save
RUN bun run bot:build

# Convert local dependency symlinks into copies
FROM build-deps AS copy-deps
RUN rm -rf /app/node_modules/@repo/database && cp -rf /app/packages/database /app/node_modules/@repo
RUN rm -rf /app/node_modules/@repo/config && cp -rf /app/packages/config /app/node_modules/@repo
RUN rm -rf /app/node_modules/phasebot && cp -rf /app/packages/phasebot /app/node_modules

# BODGE: Edit @discordjs/opus prebuild name
FROM copy-deps AS fix-bodge
RUN cd /app/node_modules/@discordjs/opus/prebuild && mv node-v115-napi-v3-linux-x64-glibc-2.31 node-v115-napi-v3-linux-x64-glibc-2.29

# Prepare the final image
FROM oven/bun:1.1.8-debian AS final
WORKDIR /app

# Copy only necessary directories and files from the previous stage
COPY --from=fix-bodge /app/apps/bot /app/apps/bot
COPY --from=fix-bodge /app/node_modules /app/node_modules
COPY --from=fix-bodge /root/.cache/puppeteer /root/.cache/puppeteer
COPY --from=fix-bodge /app/package.json /app/package.json

# Run the bot
CMD ["node_modules/.bin/phase", "start"]