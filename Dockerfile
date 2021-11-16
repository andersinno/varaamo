
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

EXPOSE 3000

# ==============================================
FROM app-base AS production
# ==============================================
ARG API_URL
ARG RESPA_ADMIN_URL
ARG LOGIN_CALLBACK_URL
ARG CLIENT_ID
ARG CLIENT_SECRET
ARG SESSION_SECRET
ARG TARGET_APP
ARG PORT
ARG AUTH_LOGOUT_URL
ARG CUSTOM_MUNICIPALITY_OPTIONS

RUN yarn build
CMD ["npm", "run", "start:production"]

EXPOSE 8080
