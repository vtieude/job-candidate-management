FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./

RUN mkdir -p src
RUN npm install
COPY src/. src/

RUN npm run build || exit 1 

## this is stage two , where the app actually runs
FROM node:22-alpine  AS production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --production
COPY --from=builder  /app/dist ./dist
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime","dist/index.js"]