
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
ARG API_URL
ENV API_URL $API_URL

ARG RESPA_ADMIN_URL
ENV RESPA_ADMIN_URL $RESPA_ADMIN_URL

ARG LOGIN_CALLBACK_URL
ENV LOGIN_CALLBACK_URL $LOGIN_CALLBACK_URL

ARG CLIENT_ID
ENV CLIENT_ID $CLIENT_ID

ARG CLIENT_SECRET
ENV CLIENT_SECRET $CLIENT_SECRET

ARG SESSION_SECRET
ENV SESSION_SECRET $SESSION_SECRET

ARG TARGET_APP
ENV TARGET_APP $TARGET_APP

ARG PORT
ENV PORT $PORT

ARG AUTH_LOGOUT_URL
ENV AUTH_LOGOUT_URL $AUTH_LOGOUT_URL

RUN yarn build
CMD ["npm", "run", "start:production"]

EXPOSE 3000