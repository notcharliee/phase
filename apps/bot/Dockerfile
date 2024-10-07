# Base image for building
FROM node:20-bullseye AS base
WORKDIR /usr/src/phase

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential python3 --no-install-recommends
RUN npm i -g bun@1.1.26

# Copy files into the image
COPY ../../bun.lockb /usr/src/phase
COPY ../../package.json /usr/src/phase
COPY ../../turbo.json /usr/src/phase
COPY ../../apps/bot /usr/src/phase/apps/bot
COPY ../../packages /usr/src/phase/packages

# Install monorepo dependencies
RUN bun install

# BODGE: Edit @discordjs/opus prebuild name
RUN cd /usr/src/phase/node_modules/@discordjs/opus/prebuild && mv node-v115-napi-v3-linux-x64-glibc-2.31 node-v127-napi-v3-linux-x64-glibc-2.29

# Build the bot
RUN bun run turbo run build

# Use a smaller oven/bun image for the final stage
FROM oven/bun:1.1.26 AS final
WORKDIR /usr/src/phase

# Copy the built files from the previous build stage
COPY --from=base /usr/src/phase /usr/src/phase

# Set the environment to production and run the bot using Bun
ENV NODE_ENV=production
CMD ["bun", "run", "start"]
