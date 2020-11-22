FROM node:12.15.0-alpine3.10

# Setting working directory. All the path will be relative to WORKDIR
WORKDIR /app

# Environment variable
ENV PORT=3000
ENV HOST 0.0.0.0
ENV JWT_KEY=8fce1218104876d8c78970cc418a77b15d9ae95bc5d68ddca5f49e98f01af9d1
ENV MONGO_URI=mongodb+srv://siddhant:tAOdBjJMrQd97RbY@ugh.0clqp.mongodb.net/ugh-prod?retryWrites=true&w=majority
ENV BASE_URL=https://www.ultimategamershub.com
ENV RAZORPAY_ID=rzp_test_LUAmxJgsyx0lJ8
ENV RAZORPAY_SECRET=2nHgyJGgDFMv8Ga2D3qjhHxG
ENV EMAIL=noreply@ultimategamershub.com
ENV PASSWORD=ImsPz5wEgDtA

# Installing dependencies
COPY package*.json ./
RUN npm install --silent

# Copying source files
COPY . .

# Building app
RUN npm run build

# Running the app
CMD npm start