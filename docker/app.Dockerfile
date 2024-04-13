FROM node:20-alpine

WORKDIR /app

RUN addgroup -g 1001 -S app && \
  adduser -u 1001 -S app -G app && \
  chown -R app:app /app && \
  chmod 770 /app

USER app:app

COPY --chown=app:app package.json ./
COPY --chown=app:app node_modules ./node_modules
COPY --chown=app:app lib ./lib
COPY --chown=app:app entrypoint.sh ./

ENTRYPOINT [ "./entrypoint.sh" ]

EXPOSE 8000
