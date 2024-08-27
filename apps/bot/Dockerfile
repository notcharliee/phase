FROM node:20-bullseye AS base
WORKDIR /usr/src/app

# Install build dependencies
FROM base AS build-env
RUN apt-get update && apt-get install -y build-essential python3 chromium fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends

# Install bun
FROM build-env AS bun-install
RUN npm i -g bun

# Copy the necessary files into the image
FROM bun-install AS copy-source
COPY ../../apps/bot /usr/src/app/apps/bot
COPY ../../packages /usr/src/app/packages
COPY ../../bun.lockb /usr/src/app/bun.lockb
COPY ../../package.json /usr/src/app/package.json
COPY ../../turbo.json /usr/src/app/turbo.json

# Install and build monorepo dependencies
FROM copy-source AS build-deps
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN bun install --no-save
RUN bun run bot:build

# BODGE: Edit @discordjs/opus prebuild name
FROM build-deps AS fix-bodge
RUN cd /usr/src/app/node_modules/@discordjs/opus/prebuild && mv node-v115-napi-v3-linux-x64-glibc-2.31 node-v115-napi-v3-linux-x64-glibc-2.29

# Prepare the final image
FROM fix-bodge AS final
WORKDIR /usr/src/app/apps/bot
ENV NODE_ENV=production

CMD ["bun", "/usr/src/app/packages/phasebot/dist/cli.js", "start"]
