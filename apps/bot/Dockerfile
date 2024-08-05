FROM node:lts-bullseye AS base
WORKDIR /app

# Install build dependencies
FROM base AS build-env
RUN apt-get update \
    && apt-get install -y build-essential python-3 wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

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
