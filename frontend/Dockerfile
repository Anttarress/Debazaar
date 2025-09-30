FROM node:18-alpine AS build

WORKDIR /app

# Install Yarn on Alpine and install deps using the lockfile
RUN apk add --no-cache yarn

COPY package.json yarn.lock ./
ENV YARN_CACHE_FOLDER=/tmp/.yarn-cache
RUN yarn install --frozen-lockfile --no-optional --network-timeout 600000 \
  && yarn cache clean

COPY . .

ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=${REACT_APP_API_URL}

RUN yarn build

FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
