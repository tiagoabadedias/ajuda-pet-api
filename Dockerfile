FROM --platform=linux/amd64 node:16-alpine as builder
USER node
ENV NODE_ENV build

WORKDIR /home/node

COPY package*.json ./
RUN npm install

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

# ---

FROM --platform=linux/amd64 node:16-alpine
USER node
ENV NODE_ENV production

WORKDIR /home/node

COPY --from=builder /home/node/package*.json ./
COPY --from=builder /home/node/node_modules/ ./node_modules/
COPY --from=builder /home/node/dist/ ./dist/

CMD ["node", "dist/main.js"]
