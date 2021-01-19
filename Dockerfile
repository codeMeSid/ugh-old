FROM node:12.15.0-alpine3.10

# Installing dependencies
COPY package*.json .
RUN npm install

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
CMD npm start