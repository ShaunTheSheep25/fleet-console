FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

ARG VITE_SENTINEL_URL
ARG VITE_AIDO_BRIDGE_WS
ENV VITE_SENTINEL_URL=$VITE_SENTINEL_URL
ENV VITE_AIDO_BRIDGE_WS=$VITE_AIDO_BRIDGE_WS

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80