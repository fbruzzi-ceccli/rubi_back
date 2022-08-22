FROM node

RUN mkdir -p /home/backend-rubi

COPY . /home/backend-rubi

EXPOSE 8080

RUN sed -i -e 's/process.env.DB_HOST_VM/"192.168.56.104"/g' /home/backend-rubi/config_DBRefr.js
RUN sed -i -e 's/process.env.DB_USER/"SaphRefrServ"/g' /home/backend-rubi/config_DBRefr.js
RUN sed -i -e 's/process.env.DB_NAME/"SaphRefrMonaco"/g' /home/backend-rubi/config_DBRefr.js

RUN sed -i -e 's/process.env.DB_HOST_VM/"192.168.56.104"/g' /home/backend-rubi/config_DBRT.js
RUN sed -i -e 's/process.env.DB_USER_REAL_TIME/"SaphTmpRServ"/g' /home/backend-rubi/config_DBRT.js
RUN sed -i -e 's/process.env.DB_NAME_REAL_TIME/"SaphTmpRMonaco"/g' /home/backend-rubi/config_DBRT.js


CMD [ "nodemon", "/home/backend-rubi/app.js" ]
