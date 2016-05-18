FROM node:6.1.0

RUN mkdir /src

WORKDIR /src

COPY package.json bower.json .bowerrc /src/

RUN npm install --production --unsafe-perm

COPY . /src

EXPOSE 3000 5000

CMD ["npm", "run", "start_prod"]
