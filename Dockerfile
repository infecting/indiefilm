FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY yarn.lock ./

RUN yarn


# Bundle app source
COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "node", "dist/server.js" ]
USER node