# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --production --legacy-peer-deps

# Copy built files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/config ./config
COPY --from=builder /app/messages ./messages

# Create logs directory
RUN mkdir -p logs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

USER nextjs

EXPOSE 3001

CMD ["node", "dist/src/main.js"]
