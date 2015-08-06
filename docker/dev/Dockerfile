FROM node:0.12

RUN mkdir /src

WORKDIR /src

COPY package.json /src/

RUN npm install --unsafe-perm

COPY . /src

EXPOSE 80 443

CMD ["npm", "run", "start"]
