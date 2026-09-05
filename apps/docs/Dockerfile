FROM oven/bun:canary AS builder

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:canary-slim AS runner

LABEL org.opencontainers.image.title="@oliverperzyk/bedrock-discord/docs" \
    org.opencontainers.image.description="A documentation website for the Bedrock Discord." \
    org.opencontainers.image.version="0.0.1" \
    org.opencontainers.image.authors="Oliwier Perzyński <olek@oliverperzyk.com>" \
    org.opencontainers.image.licenses="AGPL-3.0-only" \
    org.opencontainers.image.url="https://github.com/oliverperzyk/bedrock-discord" \
    org.opencontainers.image.documentation="https://github.com/oliverperzyk/bedrock-discord" \
    org.opencontainers.image.source="https://github.com/oliverperzyk/bedrock-discord.git"

WORKDIR /app
ENV NODE_ENV=production \
    HOME=/app

COPY --from=builder /app/.next ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/bun.lock ./bun.lock

RUN groupadd --gid 1001 app \
    && useradd --uid 1001 --gid app --no-create-home --shell /usr/sbin/nologin app \
    && chown -R app:app /app

USER app
EXPOSE ${APP_PORT}
CMD ["bun", "run", "start"]
