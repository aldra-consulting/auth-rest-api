FROM nginx:1.23.3-alpine-slim

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf

RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d

RUN mkdir /tmp/client_temp && \
    chown -R nginx:nginx /tmp/client_temp

RUN mkdir /tmp/proxy_temp_path && \
    chown -R nginx:nginx /tmp/proxy_temp_path

RUN mkdir /tmp/fastcgi_temp && \
    chown -R nginx:nginx /tmp/fastcgi_temp

RUN mkdir /tmp/uwsgi_temp && \
    chown -R nginx:nginx /tmp/uwsgi_temp

RUN mkdir /tmp/scgi_temp && \
    chown -R nginx:nginx /tmp/scgi_temp

RUN mkdir /var/cache/nginx/uwsgi_temp && \
    chown -R nginx:nginx /var/cache/nginx/uwsgi_temp

RUN touch /tmp/nginx.pid && \
    chown -R nginx:nginx /tmp/nginx.pid

USER nginx

EXPOSE 8001
