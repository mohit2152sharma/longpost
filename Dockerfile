# FROM oven/bun
FROM node:22.10.0
# TODO: Use npm ci for faster pacakge installation

RUN apt-get update && apt-get install -y --no-install-recommends \
  fonts-liberation \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  libu2f-udev \
  libxshmfence1 \
  libglu1-mesa \
  chromium \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# RUN curl -fsSL https://bun.sh/install | bash
COPY package.json package.json
COPY package-lock.json package-lock.json
# RUN bun install
# COPY package.json package.json 
RUN npm i 

# TODO: set correct database url
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/longpost
COPY . .
# RUN bun run build
RUN npm run build

EXPOSE 3000
ENV ORIGIN https://longpost.in
# ENV ORIGIN http://localhost:3000
ENV PROTOCOL_HEADER x-forwarded-proto=https
ENV HOST_HEADER x-forwarded-host=longpost.in
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"

CMD ["node", "./build"]
