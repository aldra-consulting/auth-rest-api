FROM nginx:stable-alpine-slim

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

USER nginx

EXPOSE 8001
