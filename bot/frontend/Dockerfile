FROM --platform=linux/amd64 node:18-alpine

# Update SSL packages to fix vulnerabilities
RUN apk update && \
    apk upgrade libssl3 libcrypto3 && \
    rm -rf /var/cache/apk/*

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "start"]
