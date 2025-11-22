#!/bin/sh
# Docker entrypoint script untuk backend

# Wait for MySQL to be ready
echo "⏳ Waiting for MySQL to be ready..."
max_attempts=30
attempt=0

while ! nc -z mysql 3306; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "❌ MySQL is not ready after $max_attempts attempts. Exiting..."
    exit 1
  fi
  echo "⏳ MySQL is unavailable - sleeping (attempt $attempt/$max_attempts)..."
  sleep 2
done

echo "✅ MySQL is ready!"

# Start the application
echo "🚀 Starting backend server..."
exec "$@"

