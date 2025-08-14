FROM node:16-alpine
WORKDIR /app
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN npm install
RUN npm run build

## this is stage two , where the app actually runs
FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --only=production
COPY --from=0 /app/dist .
RUN npm install pm2 -g
EXPOSE 3000
CMD ["pm2-runtime","index.js"]