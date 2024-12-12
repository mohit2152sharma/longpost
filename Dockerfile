FROM oven/bun

WORKDIR /app
COPY package.json package.json
RUN bun install

# TODO: set correct database url
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/longpost
COPY . .
RUN bun run build

EXPOSE 3000
# ENV ORIGIN longpost.in
ENV PROTOCOL_HEADER x-forwarded-proto=https
ENV HOST_HEADER x-forwarded-host=longpost.in
ENTRYPOINT ["bun", "./build"]
