FROM node:21-alpine3.19

ADD bin/wasmin /bin/wasmin
ADD apps/node-shell/dist /apps/node-shell/dist

WORKDIR /mount

ENTRYPOINT [ "/bin/wasmin" ]
