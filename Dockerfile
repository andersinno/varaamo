
# Pull node image with locked node version
FROM andersinnovations/python-node:3.8-12-slim AS app-base


COPY package.json /app/package.json 
COPY yarn.lock /app/yarn.lock

COPY . /app/

RUN yarn install

# ============================
FROM app-base AS development
# ============================

CMD ["yarn", "start"]

# ==============================================
FROM app-base AS production
# ==============================================
RUN yarn build
CMD ["npm", "run", "start:production"]

EXPOSE 8080