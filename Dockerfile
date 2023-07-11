FROM node:16-alpine

ENV PORT 3000

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app


# Installing dependencies
COPY package*.json /usr/src/app/
RUN npm install


# Copying source files
COPY . /usr/src/app
RUN npx prisma generate



# Building app
RUN npm run build
EXPOSE 3000
RUN npx prisma generate

# Running the app
CMD "npm" "run" "start"