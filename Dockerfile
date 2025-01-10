FROM node:18 AS project-dependencies
WORKDIR /chatty-api-gateway/
COPY ./package*.json ./
RUN npm install

FROM node:18 AS built-project
WORKDIR /chatty-api-gateway/
COPY ./ ./
COPY --from=project-dependencies /chatty-api-gateway/ ./
RUN npm run build

ENTRYPOINT ["npm", "run", "start:prod"]
EXPOSE 3001