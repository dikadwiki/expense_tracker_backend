# Backend Dockerfile
FROM node:18-alpine

# Install netcat for health checks and waiting
RUN apk add --no-cache netcat-openbsd

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint to wait for MySQL
ENTRYPOINT ["docker-entrypoint.sh"]

# Start server
CMD ["node", "server.js"]

