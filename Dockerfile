FROM node:16-alpine as builder

WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ARG NX_API_URL
RUN npm run build

FROM nginx:1.21.0-alpine as production
RUN mkdir /app
COPY --from=builder /src/dist/practice-works-frontend /app
COPY default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
