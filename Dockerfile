# FROM oven/bun
FROM node:22.10.0-alpine3.20

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
ENTRYPOINT ["node", "./build"]
