FROM node:22-alpine

ADD bin/wasmin /bin/wasmin
ADD apps/node-shell/dist /apps/node-shell/dist

WORKDIR /mount

ENTRYPOINT [ "/bin/wasmin" ]
