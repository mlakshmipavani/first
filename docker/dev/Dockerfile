FROM node:5.3.0

RUN mkdir /src

WORKDIR /src

COPY package.json bower.json .bowerrc /src/

RUN npm install --production --unsafe-perm

COPY . /src

EXPOSE 80 443

CMD ["npm", "run", "start"]
