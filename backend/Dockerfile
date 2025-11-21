# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (including devDependencies for building)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built artifacts from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"]
