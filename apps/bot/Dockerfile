# Base image for building
FROM node:20-bullseye AS base
WORKDIR /usr/src/phase

# Install build dependencies
RUN apt-get update && apt-get install -y build-essential python3 --no-install-recommends

# Copy package manifests first and install dependencies
COPY ../../bun.lockb ./ 
COPY ../../package.json ./
COPY ../../turbo.json ./
RUN npm i -g bun@1.1.26 && bun install

# Copy the remaining source files
COPY ../../apps/bot ./apps/bot
COPY ../../packages ./packages

# BODGE: Edit @discordjs/opus prebuild name
RUN cd ./node_modules/@discordjs/opus/prebuild && mv node-v115-napi-v3-linux-x64-glibc-2.31 node-v127-napi-v3-linux-x64-glibc-2.29

# Build the bot
RUN turbo run build

# Use a smaller oven/bun image for the final stage
FROM oven/bun:1.1.26 AS final
WORKDIR /usr/src/phase

# Copy the built files from the previous build stage
COPY --from=base /usr/src/phase /usr/src/phase

# Set the environment to production and run the bot using Bun
ENV NODE_ENV=production
CMD ["bun", "--smol", "run", "start"]
