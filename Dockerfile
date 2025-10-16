FROM node:lts AS base
WORKDIR /app

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json package-lock.json ./

# install dependencies
FROM base AS prod-deps
RUN npm install --omit=dev

# 
FROM base AS build-deps
RUN npm install
# prisma 
FROM build-deps AS prisma-generate
COPY . .
RUN npx prisma generate

# build
FROM prisma-generate AS build
RUN npm run build

# runtime image

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

COPY server.crt /etc/ssl/certs/server.crt
COPY server.key /etc/ssl/private/server.key

ENV SERVER_KEY_PATH=/etc/ssl/private/server.key
ENV SERVER_CERT_PATH=/etc/ssl/certs/server.crt


ENV HOST=0.0.0.0
ENV PORT=3443
EXPOSE 3433
CMD node ./dist/server/entry.mjs
