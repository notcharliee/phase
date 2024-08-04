# Base image with Bun and Debian
FROM oven/bun:debian AS base
WORKDIR /app

# Install apt packages
FROM base AS apt-deps
RUN apt-get update && apt-get install -y \
    curl \
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

# Install Node.js
FROM apt-deps AS node-deps
RUN curl -sL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs

# Copy the entire monorepo source code
# Since we're in apps/bot, the monorepo root is one directory up.
COPY ../../ /app

# Install dependencies with Bun for the entire monorepo
RUN bun install

# Build dependencies using Turbo
RUN bun run bot:build

# Prepare the final image
FROM node-deps AS final
WORKDIR /app

# Copy the bot source code to /app
COPY --from=node-deps /app/apps/bot /app

# Copy the node_modules
COPY --from=node-deps /app/node_modules /app/node_modules

# Set the command to start the bot
CMD ["bun", "start"]
