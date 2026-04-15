FROM nginx:alpine

# Удаляем дефолтный конфиг
RUN rm /etc/nginx/conf.d/default.conf

# Копируем свой nginx конфиг
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Копируем фронтенд
COPY frontend/src /usr/share/nginx/html
COPY frontend/public /usr/share/nginx/html/public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]