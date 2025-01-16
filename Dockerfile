FROM node:23 AS project-dependencies
WORKDIR /chatty-api-gateway/
COPY ./package*.json ./
RUN npm install

FROM node:23 AS built-project
WORKDIR /chatty-api-gateway/
COPY ./ ./
COPY --from=project-dependencies /chatty-api-gateway/ ./
RUN npm run build
RUN chmod a+x ./start.sh

ENTRYPOINT ["./start.sh"]
EXPOSE 3000