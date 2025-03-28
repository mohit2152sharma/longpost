# FROM oven/bun
FROM node:22.10.0

# TODO: Use docker secrets for api secrets and not build args
# dokploy doesn't support docker secrets as a workaround using build args
ARG DATABASE_URL
ARG STRIPE_SECRET_KEY
ARG STRIPE_WEBHOOK_SECRET
ARG MY_ENV=dev

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
RUN npm ci 

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
