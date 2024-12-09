FROM node:lts-alpine
ENV NODE_ENV=dev
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install
# RUN npm install -g ts-node
# RUN npm install -g nodemon
COPY . .
EXPOSE 4000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "dev"]
