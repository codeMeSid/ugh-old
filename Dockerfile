FROM node:12.19.0-alpine3.10

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /usr/src/app

# Environment variable
ENV PORT=3000
ENV JWT_KEY=qazwsxedcrfv
ENV MONGO_URI=mongodb+srv://sid:GLmpWOpwHkDgygAs@cluster0-6knev.mongodb.net/ugh-lite
ENV BASE_URL=http://localhost:3000
ENV RAZORPAY_ID=rzp_test_LUAmxJgsyx0lJ8
ENV RAZORPAY_SECRET=2nHgyJGgDFMv8Ga2D3qjhHxG
ENV EMAIL=noreply@ultimategamershub.com
ENV PASSWORD=ImsPz5wEgDtA

# Installing dependencies
COPY package*.json ./
RUN npm install --force

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
CMD [ "npm", "start" ]