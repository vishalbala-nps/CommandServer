FROM node:21.6-alpine
WORKDIR /api
ADD ./* /api/
RUN npm install
ENV NODE_ENV production
EXPOSE 8080
CMD ["npx","pm2-runtime","ecosystem.config.js"]