FROM oven/bun

WORKDIR /app
COPY package.json package.json
RUN bun install

# TODO: set correct database url
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/longpost
COPY . .
RUN bun run build

EXPOSE 3000
ENV ORIGIN=http://longpost.in
ENTRYPOINT ["bun", "./build"]
