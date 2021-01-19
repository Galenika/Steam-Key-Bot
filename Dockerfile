FROM node
WORKDIR /home/node/app
RUN npm install discord.js
COPY config.json config.json
RUN echo "[]" > db.json
COPY index.js index.js