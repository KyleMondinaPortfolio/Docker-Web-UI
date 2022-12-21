FROM node:lts-alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
RUN useradd admin && echo "admin:admin" | chpasswd && adduser admin sudo
USER admin
CMD ["node", "server.js"]
