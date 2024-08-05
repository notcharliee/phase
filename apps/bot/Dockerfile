# Base image with Bun and Debian
FROM node:lts-bullseye AS base
WORKDIR /app

# Install apt packages
FROM base AS apt-deps
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
FROM apt-deps AS node-deps
RUN npm i -g bun

# Copy the entire monorepo source code
COPY ../../ /app

# Install dependencies with Bun for the entire monorepo
RUN bun install
RUN bun run puppeteer browsers install chrome

# Build dependencies using Turbo
RUN bun run bot:build

# Convert workspace symlinks to copies
RUN rm -rf /app/node_modules/@repo/database && cp -rf /app/packages/database /app/node_modules/@repo
RUN rm -rf /app/node_modules/@repo/config && cp -rf /app/packages/config /app/node_modules/@repo
RUN rm -rf /app/node_modules/phasebot && cp -rf /app/packages/phasebot /app/node_modules

# Prepare the final image
FROM oven/bun:1.1.8-debian AS final
WORKDIR /app

# Copy only necessary directories and files from the previous stage
COPY --from=node-deps /app/apps/bot /app/apps/bot
COPY --from=node-deps /app/node_modules /app/node_modules
COPY --from=node-deps /root/.cache/puppeteer /root/.cache/puppeteer
COPY --from=node-deps /app/package.json /app/package.json
