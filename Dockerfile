# Dockerfile for app node version 20
FROM node:20

# Workdir
WORKDIR /app

# copy file package.json in WORKDIR
COPY package.json ./

# install npm
RUN npm install

# cop all file from source to destination
COPY . .

# expose port
EXPOSE 4000

# RUN the application for nodemon
CMD ["npm", "run", "dev"]
