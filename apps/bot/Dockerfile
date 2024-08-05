FROM node:lts-bullseye AS base
WORKDIR /app

# Install build dependencies
FROM base AS build-env
RUN sudo apt-get update && \
    sudo apt-get install -y \
        build-essential \
        python-3 \
        ca-certificates \
        fonts-liberation \
        libappindicator3-1 \
        libasound2 \
        libatk-bridge2.0-0 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgbm1 \
        libgcc1 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
        libnss3 \
        libpango-1.0-0 \
        libpangocairo-1.0-0 \
        libstdc++6 \
        libx11-6 \
        libx11-xcb1 \
        libxcb1 \
        libxcomposite1 \
        libxcursor1 \
        libxdamage1 \
        libxext6 \
        libxfixes3 \
        libxi6 \
        libxrandr2 \
        libxrender1 \
        libxss1 \
        libxtst6 \
        lsb-release \
        wget \
        xdg-utils && \
    rm -rf /var/lib/apt/lists/*

# Install bun
FROM base AS bun-install
RUN npm i -g bun

# Copy the necessary files into the image
FROM bun-install AS copy-source
COPY ../../apps/bot /app/apps/bot
COPY ../../packages /app/packages
COPY ../../bun.lockb /app/bun.lockb
COPY ../../package.json /app/package.json
COPY ../../turbo.json /app/turbo.json

# Install and build monorepo dependencies
FROM copy-source AS build-deps
RUN bun install --no-save
RUN bun run bot:build

# BODGE: Edit @discordjs/opus prebuild name
FROM build-deps AS fix-bodge
RUN cd /app/node_modules/@discordjs/opus/prebuild && mv node-v115-napi-v3-linux-x64-glibc-2.31 node-v115-napi-v3-linux-x64-glibc-2.29

# Prepare the final image
FROM fix-bodge AS final
WORKDIR /app/apps/bot

CMD ["bun", "/app/packages/phasebot/dist/cli/index.js", "start"]
