# Stage 1: Build
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod +x node_modules/.bin/ng
RUN npm install -g @angular/cli
RUN npm run build -- --configuration production --base-href=/

RUN ls -l /app/dist/sakai-ng/browser

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist/sakai-ng/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]


