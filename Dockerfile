FROM node:10 AS build
WORKDIR /app
COPY . ./
RUN npm ci
RUN touch .env
RUN npm run build

FROM node:10
WORKDIR /app
COPY --from=build /app/package*.json  ./
RUN npm ci --only=production
COPY --from=build /app/dist dist/
EXPOSE 3007
ENTRYPOINT [ "node", "dist/server.js"]
