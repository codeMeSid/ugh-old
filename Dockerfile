FROM node:12.15.0-alpine3.10

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app

# Installing dependencies
COPY package*.json .
RUN npm install --silent

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
CMD npm start