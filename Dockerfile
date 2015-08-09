FROM node:0.12

RUN mkdir /src

WORKDIR /src

COPY package.json bower.json .bowerrc /src/

RUN npm install --production --unsafe-perm

COPY . /src

EXPOSE 80 443

CMD ["npm", "run", "start_prod"]